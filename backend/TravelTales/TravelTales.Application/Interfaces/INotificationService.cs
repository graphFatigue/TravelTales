using TravelTales.Application.DTOs.Notification;

namespace TravelTales.Application.Interfaces
{
    public interface INotificationService
    {
        Task<NotificationDto> CreateNotificationAsync(CreateNotificationDto notificationDto, CancellationToken cancellationToken = default);
        Task<List<NotificationDto>> GetNotificationsForBloggerAsync(long bloggerId, CancellationToken cancellationToken = default);
        Task MarkAsReadAsync(long notificationId, CancellationToken cancellationToken = default);
    }
}
