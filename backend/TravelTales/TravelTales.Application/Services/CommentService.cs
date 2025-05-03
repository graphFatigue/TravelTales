using AutoMapper;
using FluentValidation;
using TravelTales.Application.DTOs.Comment;
using TravelTales.Application.DTOs.Notification;
using TravelTales.Application.Exceptions;
using TravelTales.Application.Interfaces;
using TravelTales.Domain.Entities;
using TravelTales.Persistence.Interfaces;
using TravelTales.Persistence.Repositories;

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

        public async Task<CommentDto> CreateCommentAsync(CreateCommentDto commentDto, long bloggerId, CancellationToken cancellationToken = default)
        {
            await createValidator.ValidateAndThrowAsync(commentDto);

            var comment = mapper.Map<Comment>(commentDto);
            comment.BloggerId = bloggerId;
            comment.CreatedAt = DateTime.UtcNow;

            await this.unitOfWork.GetRepository<ICommentRepository>().AddAsync(comment);
            await this.unitOfWork.SaveChangesAsync();

            var post = await this.unitOfWork.GetRepository<IPostRepository>().GetByIdAsync(commentDto.PostId);
            if (post != null && post.BloggerId != bloggerId)
            {
                var isBlocked = await this.unitOfWork.GetRepository<IBloggerBlockRepository>().ExistsAsync(post.BloggerId, bloggerId, cancellationToken);
                if (!isBlocked)
                {
                    var notificationDto = new CreateNotificationDto
                    {
                        Message = "New comment on your post",
                        RecipientBloggerId = (long)post.BloggerId,
                        TriggeredByBloggerId = bloggerId,
                        PostId = post.Id,
                        CommentId = comment.Id
                    };
                    var notification = await this.notificationService.CreateNotificationAsync(notificationDto);

                    // Access the blogger name through the DTO
                    var triggeredByName = notification.TriggeredByBlogger != null
                        ? $"{notification.TriggeredByBlogger.FirstName} {notification.TriggeredByBlogger.LastName}"
                        : "Anonymous";

                    // Use this name in your real-time notification if needed
                }
            }

            return mapper.Map<CommentDto>(comment);
        }

        public async Task UpdateCommentAsync(long commentId, UpdateCommentDto commentDto, long bloggerId, CancellationToken cancellationToken = default)
        {
            await updateValidator.ValidateAndThrowAsync(commentDto);

            var comment = await GetCommentWithAuthorization(commentId, bloggerId);

            comment.Content = commentDto.Content;
            comment.ModifiedAt = DateTime.UtcNow;

            unitOfWork.GetRepository<ICommentRepository>().Update(comment);
            await unitOfWork.SaveChangesAsync();
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