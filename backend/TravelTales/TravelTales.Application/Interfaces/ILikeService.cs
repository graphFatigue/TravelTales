using TravelTales.Application.DTOs.PostLike;

namespace TravelTales.Application.Interfaces
{
    public interface ILikeService
    {
        Task AddLikeAsync(CreatePostLikeDto createPostLikeDto);

        Task<bool> IsLikedAsync(long postId, long bloggerId);

        Task<int> CountLikesByPostIdAsync(long postId);
    }
}
