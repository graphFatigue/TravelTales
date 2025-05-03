using TravelTales.Domain.Entities;

namespace TravelTales.Persistence.Interfaces
{
    public interface INotificationRepository : IGenericRepository<Notification, long>
    {
        //Task<List<Notification>> GetByRecipientIdAsync(long bloggerId, CancellationToken cancellationToken = default);
        Task<List<Notification>> GetByRecipientIdFullAsync(long bloggerId, CancellationToken cancellationToken = default);
        Task<Notification?> GetByIdFullAsync(long id, CancellationToken cancellationToken = default);
    }
}
