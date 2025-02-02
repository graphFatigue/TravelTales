using Sieve.Models;
using TravelTales.Application.DTOs.Comment;
using TravelTales.Persistence.SharedFiles;

namespace TravelTales.Application.Interfaces
{
    public interface ICommentService
    {
        Task<IEnumerable<CommentDto>> GetCommentsByPostIdAsync(long postId, CancellationToken cancellationToken = default);

        Task AddCommentAsync(CreateCommentDto createCommentDto, CancellationToken cancellationToken = default);

        Task<int> CountCommentsByPostIdAsync(long postId);

        Task UpdateCommentAsync(long id, UpdateCommentDto updateCommentDto, CancellationToken cancellationToken = default);

        Task DeleteCommentAsync(long id, CancellationToken cancellationToken = default);

        Task<PagedList<CommentDto>> GetCommentsWithFilterAsync(SieveModel sieveModel, CancellationToken cancellationToken = default);
    }
}
