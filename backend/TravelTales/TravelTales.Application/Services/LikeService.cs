using AutoMapper;
using TravelTales.Application.DTOs.PostLike;
using TravelTales.Application.Interfaces;
using TravelTales.Domain.Entities;
using TravelTales.Persistence.Interfaces;

namespace TravelTales.Application.Services
{
    public class LikeService : ILikeService
    {
        private readonly ILikeRepository likeRepository;
        private readonly IMapper mapper;

        public LikeService(ILikeRepository likeRepository, IMapper mapper)
        {
            this.likeRepository = likeRepository;
            this.mapper = mapper;
        }

        public async Task AddLikeAsync(CreatePostLikeDto createPostLikeDto)
        {
            ValidateCreatePostLikeDto(createPostLikeDto);
            await this.PerformAddOrRemoveLikeAsync(createPostLikeDto);
        }

        public async Task<int> CountLikesByPostIdAsync(long postId)
        {
            return await this.likeRepository.CountLikesByPostIdAsync(postId);
        }

        public async Task<bool> IsLikedAsync(long postId, long bloggerId)
        {
            return await this.likeRepository.IsLikedAsync(postId, bloggerId);
        }

        private static void ValidateCreatePostLikeDto(CreatePostLikeDto createPostLikeDto)
        {
            ArgumentNullException.ThrowIfNull(createPostLikeDto);
        }

        private async Task PerformAddOrRemoveLikeAsync(CreatePostLikeDto createPostLikeDto)
        {
            var like = this.mapper.Map<PostLike>(createPostLikeDto);

            if (await this.IsLikedAsync(createPostLikeDto.PostId, createPostLikeDto.BloggerId))
            {
                await this.likeRepository.RemoveLikeAsync(like);
            }
            else
            {
                await this.likeRepository.AddLikeAsync(like);
            }
        }
    }
}
