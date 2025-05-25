using Sieve.Models;
using TravelTales.Application.DTOs.Comment;
using TravelTales.Persistence.SharedFiles;

namespace TravelTales.Application.Interfaces
{
    public interface ICommentService
    {
        Task<CommentBroadcastDto> CreateCommentAsync(CreateCommentDto commentDto, long bloggerId, CancellationToken cancellationToken = default);

        Task<CommentBroadcastDto> UpdateCommentAsync(long commentId, UpdateCommentDto commentDto, long bloggerId, CancellationToken cancellationToken = default);

        Task DeleteCommentAsync(long commentId, long bloggerId, CancellationToken cancellationToken = default);

        Task<List<CommentDto>> GetCommentsByPostIdAsync(long postId, CancellationToken cancellationToken = default);

        Task<PagedList<CommentDto>> GetCommentsWithFilterAsync(SieveModel sieveModel, CancellationToken cancellationToken = default);
    }
}
