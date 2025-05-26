using AutoMapper;
using FluentValidation;
using Sieve.Models;
using TravelTales.Application.DTOs.Comment;
using TravelTales.Application.DTOs.Notification;
using TravelTales.Application.Exceptions;
using TravelTales.Application.Interfaces;
using TravelTales.Domain.Entities;
using TravelTales.Persistence.Interfaces;
using TravelTales.Persistence.SharedFiles;

namespace TravelTales.Application.Services
{
    public class CommentService : ICommentService
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly IMapper mapper;
        private readonly INotificationService notificationService;
        private readonly IValidator<CreateCommentDto> createValidator;
        private readonly IValidator<UpdateCommentDto> updateValidator;

        public CommentService(
            IUnitOfWork unitOfWork,
            IMapper mapper,
            INotificationService notificationService,
            IValidator<CreateCommentDto> createValidator,
            IValidator<UpdateCommentDto> updateValidator)
        {
            this.unitOfWork = unitOfWork;
            this.mapper = mapper;
            this.notificationService = notificationService;
            this.createValidator = createValidator;
            this.updateValidator = updateValidator;
        }

        public async Task<CommentBroadcastDto> CreateCommentAsync(CreateCommentDto commentDto, long bloggerId, CancellationToken cancellationToken = default)
        {
            await createValidator.ValidateAndThrowAsync(commentDto);

            var comment = mapper.Map<Comment>(commentDto);
            comment.BloggerId = bloggerId;
            comment.CreatedAt = DateTime.UtcNow;

            await this.unitOfWork.GetRepository<ICommentRepository>().AddAsync(comment);
            await this.unitOfWork.SaveChangesAsync();

            // Eager load related entities for mapping
            comment.Post = await unitOfWork.GetRepository<IPostRepository>().GetByIdAsync(commentDto.PostId);
            comment.Blogger = await unitOfWork.GetRepository<IBloggerRepository>().GetByIdAsync(bloggerId);

            if (comment.Post != null && comment.Post.BloggerId != bloggerId)
            {
                var isBlocked = await unitOfWork.GetRepository<IBloggerBlockRepository>()
                    .ExistsAsync(comment.Post.BloggerId, bloggerId, cancellationToken);
                if (!isBlocked)
                {
                    var notificationDto = new CreateNotificationDto
                    {
                        Message = "New comment on your post",
                        RecipientBloggerId = (long)comment.Post.BloggerId,
                        TriggeredByBloggerId = bloggerId,
                        PostId = comment.Post.Id,
                        CommentId = comment.Id
                    };
                    var notification = await this.notificationService.CreateNotificationAsync(notificationDto);
                }
            }

            return mapper.Map<CommentBroadcastDto>(comment);
        }

        public async Task<CommentBroadcastDto> UpdateCommentAsync(long commentId, UpdateCommentDto commentDto, long bloggerId, CancellationToken cancellationToken = default)
        {
            await updateValidator.ValidateAndThrowAsync(commentDto);

            var comment = await GetCommentWithAuthorization(commentId, bloggerId);

            comment.Content = commentDto.Content;
            comment.ModifiedAt = DateTime.UtcNow;

            unitOfWork.GetRepository<ICommentRepository>().Update(comment);
            await unitOfWork.SaveChangesAsync();

            return mapper.Map<CommentBroadcastDto>(comment);
        }

        public async Task DeleteCommentAsync(long commentId, long bloggerId, CancellationToken cancellationToken = default)
        {
            var comment = await GetCommentWithAuthorization(commentId, bloggerId);

            unitOfWork.GetRepository<ICommentRepository>().Delete(comment);
            await unitOfWork.SaveChangesAsync();
        }

        public async Task<List<CommentDto>> GetCommentsByPostIdAsync(long postId, CancellationToken cancellationToken = default)
        {
            var comments = await unitOfWork.GetRepository<ICommentRepository>()
                .GetCommentsByPostIdAsync(postId);

            return mapper.Map<List<CommentDto>>(comments);
        }

        public async Task<PagedList<CommentBroadcastDto>> GetCommentsWithFilterAsync(SieveModel sieveModel, CancellationToken cancellationToken = default)
        {
            var pagedList = await this.unitOfWork.GetRepository<ICommentRepository>()
                .GetAllWithFilterAsync(sieveModel, cancellationToken);

            var filteredComments = this.mapper.Map<List<CommentBroadcastDto>>(pagedList.Items)
                .Where(c => !c.IsDeleted)
                .ToList();

            return PagedList<CommentBroadcastDto>.Copy(pagedList, filteredComments);
        }

        private async Task<Comment> GetCommentWithAuthorization(long commentId, long bloggerId, CancellationToken cancellationToken = default)
        {
            var comment = await unitOfWork.GetRepository<ICommentRepository>()
                .GetByIdAsync(commentId);

            if (comment == null)
                throw new NotFoundException("Comment not found");

            //if (comment.BloggerId != bloggerId)
            //    throw new PermissionException("You don't have permission to modify this comment");

            return comment;
        }
    }
}