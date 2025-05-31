using AutoMapper;
using System.Threading;
using TravelTales.Application.DTOs.Notification;
using TravelTales.Application.DTOs.PostLike;
using TravelTales.Application.Interfaces;
using TravelTales.Domain.Entities;
using TravelTales.Persistence;
using TravelTales.Persistence.Interfaces;

namespace TravelTales.Application.Services
{
    public class LikeService : ILikeService
    {
        private readonly ILikeRepository likeRepository;
        private readonly IMapper mapper;
        private readonly IUnitOfWork unitOfWork;
        private readonly INotificationService notificationService;

        public LikeService(ILikeRepository likeRepository, IMapper mapper, IUnitOfWork unitOfWork, INotificationService notificationService)
        {
            this.likeRepository = likeRepository;
            this.mapper = mapper;
            this.unitOfWork = unitOfWork;
            this.notificationService = notificationService;
        }

        public async Task<NotificationDto?> AddLikeAsync(CreatePostLikeDto createPostLikeDto, CancellationToken cancellationToken = default)
        {
            ValidateCreatePostLikeDto(createPostLikeDto);
            return await this.PerformAddOrRemoveLikeAsync(createPostLikeDto);
        }

        public async Task<int> CountLikesByPostIdAsync(long postId)
        {
            return await this.likeRepository.CountLikesByPostIdAsync(postId);
        }

        public async Task<bool> IsLikedAsync(long postId, long bloggerId)
        {
            return await this.likeRepository.IsLikedAsync(postId, bloggerId);
        }

        private async Task<NotificationDto?> CreateNotificationForLike(PostLike like, CancellationToken cancellationToken = default)
        {
            // Load post with author information
            var post = await this.unitOfWork.GetRepository<IPostRepository>()
                .GetByIdFullAsync(like.PostId, cancellationToken);

            if (post == null) return null;

            // Skip notification if user is liking their own post
            if (post.BloggerId == like.BloggerId) return null;

            // Check if author has blocked the liker
            var isBlocked = await this.unitOfWork.GetRepository<IBloggerBlockRepository>()
                .ExistsAsync(post.BloggerId, like.BloggerId, cancellationToken);

            if (isBlocked) return null;

            var notificationDto = new CreateNotificationDto
            {
                Message = "Someone liked your post",
                RecipientBloggerId = (long)post.BloggerId,
                TriggeredByBloggerId = like.BloggerId,
                LikeId = like.Id,
                PostId = like.PostId,
                LikedPostId = like.PostId,
                LikedBloggerId = like.BloggerId
            };

            return await this.notificationService.CreateNotificationAsync(notificationDto, cancellationToken);
        }

    private static void ValidateCreatePostLikeDto(CreatePostLikeDto createPostLikeDto)
        {
            ArgumentNullException.ThrowIfNull(createPostLikeDto);
        }

        private async Task<NotificationDto?> PerformAddOrRemoveLikeAsync(CreatePostLikeDto createPostLikeDto, CancellationToken cancellationToken = default)
        {
            var like = this.mapper.Map<PostLike>(createPostLikeDto);

            if (await this.IsLikedAsync(createPostLikeDto.PostId, createPostLikeDto.BloggerId))
            {
                //await this.likeRepository.RemoveLikeAsync(like);
                //await unitOfWork.SaveChangesAsync(cancellationToken);
                await this.likeRepository.RemoveLikeAsync(
                    createPostLikeDto.PostId,
                    createPostLikeDto.BloggerId);
                return null;
            }
            else
            {
                await this.likeRepository.AddLikeAsync(like);
                return await CreateNotificationForLike(like, cancellationToken);
            }
        }
    }
}
