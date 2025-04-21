using Sieve.Models;
using TravelTales.Application.DTOs.Comment;
using TravelTales.Persistence.SharedFiles;

namespace TravelTales.Application.Interfaces
{
    public interface ICommentService
    {
        Task<CommentDto> CreateCommentAsync(CreateCommentDto commentDto, long bloggerId);

        Task UpdateCommentAsync(long commentId, UpdateCommentDto commentDto, long bloggerId);

        Task DeleteCommentAsync(long commentId, long bloggerId);

        Task<List<CommentDto>> GetCommentsByPostIdAsync(long postId);
    }
}
