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

        public async Task<List<Notification>> GetByRecipientIdFullAsync(long bloggerId, CancellationToken cancellationToken = default)
        {
            return await DbSet
                .Include(n => n.RecipientBlogger)
                .Include(n => n.TriggeredByBlogger)
                .Include(n => n.Post)
                .Include(n => n.Comment)
                .Where(n => n.RecipientBloggerId == bloggerId && !n.IsDeleted)
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync(cancellationToken);
        }

        public async Task<Notification?> GetByIdFullAsync(long id, CancellationToken cancellationToken = default)
        {
            return await DbSet
                .Include(n => n.RecipientBlogger)
                .Include(n => n.TriggeredByBlogger)
                .Include(n => n.Post)
                .Include(n => n.Comment)
                .FirstOrDefaultAsync(n => n.Id == id && !n.IsDeleted, cancellationToken);
        }
    }
}
