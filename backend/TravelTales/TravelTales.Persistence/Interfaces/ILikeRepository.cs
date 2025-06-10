using TravelTales.Domain.Entities;

namespace TravelTales.Persistence.Interfaces
{
    public interface ILikeRepository
    {
        Task AddLikeAsync(PostLike postLike);

        Task RemoveLikeAsync(PostLike postLike);

        Task<bool> IsLikedAsync(long postId, long bloggerId);

        Task<int> CountLikesByPostIdAsync(long postId);

        Task<List<PostLike>> GetLikesByPostIdAsync(long postId, CancellationToken cancellationToken = default);
    }
}
