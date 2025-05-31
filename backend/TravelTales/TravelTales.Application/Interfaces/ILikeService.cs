using TravelTales.Application.DTOs.Notification;
using TravelTales.Application.DTOs.PostLike;

namespace TravelTales.Application.Interfaces
{
    public interface ILikeService
    {
        Task<NotificationDto?> AddLikeAsync(CreatePostLikeDto createPostLikeDto, CancellationToken cancellationToken = default);

        Task<bool> IsLikedAsync(long postId, long bloggerId);

        Task<int> CountLikesByPostIdAsync(long postId);
    }
}
