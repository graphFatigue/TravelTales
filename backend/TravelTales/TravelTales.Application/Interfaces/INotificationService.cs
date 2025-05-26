using Sieve.Models;
using TravelTales.Application.DTOs.Notification;
using TravelTales.Persistence.SharedFiles;

namespace TravelTales.Application.Interfaces
{
    public interface INotificationService
    {
        Task<NotificationDto> CreateNotificationAsync(CreateNotificationDto notificationDto, CancellationToken cancellationToken = default);
        Task<List<NotificationDto>> GetNotificationsForBloggerAsync(long bloggerId, CancellationToken cancellationToken = default);
        Task MarkAsReadAsync(long notificationId, CancellationToken cancellationToken = default);
        Task<PagedList<NotificationDto>> GetNotificationsAsync(SieveModel sieveModel, CancellationToken cancellationToken = default);
        Task MarkAllAsReadAsync(CancellationToken cancellationToken = default);
    }
}
