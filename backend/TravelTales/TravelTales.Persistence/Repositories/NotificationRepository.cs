using Microsoft.EntityFrameworkCore;
using Sieve.Models;
using Sieve.Services;
using TravelTales.Domain.Entities;
using TravelTales.Persistence.Interfaces;
using TravelTales.Persistence.SharedFiles;

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

        public override async Task<PagedList<Notification>> GetAllWithFilterAsync(
            SieveModel sieveModel,
            CancellationToken cancellationToken = default)
        {
            var query = DbSet
                .Include(n => n.RecipientBlogger)
                .Include(n => n.TriggeredByBlogger)
                .Include(n => n.Post)
                .Include(n => n.Comment)
                .Where(n => !n.IsDeleted)
                .OrderByDescending(n => n.CreatedAt);

            var filteredQuery = this.sieveProcessor.Apply(sieveModel, query, applyPagination: false);
            return await PagedList<Notification>.ToPagedListAsync(filteredQuery, sieveModel);
        }
    }
}
