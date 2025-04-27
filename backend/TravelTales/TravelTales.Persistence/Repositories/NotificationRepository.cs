using Microsoft.EntityFrameworkCore;
using Sieve.Services;
using TravelTales.Domain.Entities;
using TravelTales.Persistence.Interfaces;

namespace TravelTales.Persistence.Repositories
{
    public class NotificationRepository : GenericRepository<Notification, long>, INotificationRepository
    {
        public NotificationRepository(AppDbContext context, ISieveProcessor sieveProcessor)
            : base(context, sieveProcessor)
        {
        }

        public async Task<List<Notification>> GetByRecipientIdAsync(long bloggerId, CancellationToken cancellationToken = default)
        {
            return await DbSet
                .Where(n => n.RecipientBloggerId == bloggerId && !n.IsDeleted)
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync(cancellationToken);
        }
    }
}
