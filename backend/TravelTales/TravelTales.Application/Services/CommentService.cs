using AutoMapper;
using FluentValidation;
using TravelTales.Application.DTOs.Comment;
using TravelTales.Application.Exceptions;
using TravelTales.Application.Interfaces;
using TravelTales.Domain.Entities;
using TravelTales.Persistence.Interfaces;

namespace TravelTales.Application.Services
{
    public class CommentService : ICommentService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IValidator<CreateCommentDto> _createValidator;
        private readonly IValidator<UpdateCommentDto> _updateValidator;

        public CommentService(
            IUnitOfWork unitOfWork,
            IMapper mapper,
            IValidator<CreateCommentDto> createValidator,
            IValidator<UpdateCommentDto> updateValidator)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _createValidator = createValidator;
            _updateValidator = updateValidator;
        }

        public async Task<CommentDto> CreateCommentAsync(CreateCommentDto commentDto, long bloggerId)
        {
            await _createValidator.ValidateAndThrowAsync(commentDto);

            var comment = _mapper.Map<Comment>(commentDto);
            comment.BloggerId = bloggerId;
            comment.CreatedAt = DateTime.UtcNow;

            await _unitOfWork.GetRepository<ICommentRepository>().AddAsync(comment);
            await _unitOfWork.SaveChangesAsync();

            return _mapper.Map<CommentDto>(comment);
        }

        public async Task UpdateCommentAsync(long commentId, UpdateCommentDto commentDto, long bloggerId)
        {
            await _updateValidator.ValidateAndThrowAsync(commentDto);

            var comment = await GetCommentWithAuthorization(commentId, bloggerId);

            comment.Content = commentDto.Content;
            comment.ModifiedAt = DateTime.UtcNow;

            _unitOfWork.GetRepository<ICommentRepository>().Update(comment);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task DeleteCommentAsync(long commentId, long bloggerId)
        {
            var comment = await GetCommentWithAuthorization(commentId, bloggerId);

            _unitOfWork.GetRepository<ICommentRepository>().Delete(comment);
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task<List<CommentDto>> GetCommentsByPostIdAsync(long postId)
        {
            var comments = await _unitOfWork.GetRepository<ICommentRepository>()
                .GetCommentsByPostIdAsync(postId);

            return _mapper.Map<List<CommentDto>>(comments);
        }

        private async Task<Comment> GetCommentWithAuthorization(long commentId, long bloggerId)
        {
            var comment = await _unitOfWork.GetRepository<ICommentRepository>()
                .GetByIdAsync(commentId);

            if (comment == null)
                throw new NotFoundException("Comment not found");

            //if (comment.BloggerId != bloggerId)
            //    throw new PermissionException("You don't have permission to modify this comment");

            return comment;
        }
    }
}