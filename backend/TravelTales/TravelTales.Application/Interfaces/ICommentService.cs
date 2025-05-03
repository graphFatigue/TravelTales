using TravelTales.Application.DTOs.Comment;

namespace TravelTales.Application.Interfaces
{
    public interface ICommentService
    {
        Task<CommentDto> CreateCommentAsync(CreateCommentDto commentDto, long bloggerId, CancellationToken cancellationToken = default);

        Task UpdateCommentAsync(long commentId, UpdateCommentDto commentDto, long bloggerId, CancellationToken cancellationToken = default);

        Task DeleteCommentAsync(long commentId, long bloggerId, CancellationToken cancellationToken = default);

        Task<List<CommentDto>> GetCommentsByPostIdAsync(long postId, CancellationToken cancellationToken = default);
    }
}
