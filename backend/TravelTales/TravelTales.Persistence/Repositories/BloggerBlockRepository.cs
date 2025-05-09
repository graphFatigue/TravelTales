using Microsoft.EntityFrameworkCore;
using TravelTales.Domain.Entities;
using TravelTales.Persistence.Interfaces;

namespace TravelTales.Persistence.Repositories
{
    public class BloggerBlockRepository : IBloggerBlockRepository
    {
        private readonly AppDbContext context; // or your specific DbContext
        public BloggerBlockRepository(AppDbContext context)
        {
            this.context = context;
        }

        // Retrieves a specific block relationship, or null if none
        public async Task<BloggerBlock> GetAsync(long blockerId, long blockedId, CancellationToken cancellationToken = default)
        {
            return await this.context.Set<BloggerBlock>()
                                 .FindAsync(blockerId, blockedId);
        }

        // Returns all IDs that the given user has blocked
        public async Task<IEnumerable<long>> GetBlockedBloggerIdsAsync(long blockerId, CancellationToken cancellationToken = default)
        {
            return await this.context.Set<BloggerBlock>()
                                 .Where(bb => bb.BlockerId == blockerId)
                                 .Select(bb => bb.BlockedId)
                                 .ToListAsync();
        }

        public void Add(BloggerBlock block)
        {
            context.Set<BloggerBlock>().Add(block);
        }

        public void Remove(BloggerBlock block)
        {
            context.Set<BloggerBlock>().Remove(block);
        }

        public async Task<IEnumerable<long>> GetBlockerIdsAsync(long blockedId, CancellationToken cancellationToken = default)
        {
            return await context.Set<BloggerBlock>()
                .Where(bb => bb.BlockedId == blockedId)
                .Select(bb => bb.BlockerId)
                .ToListAsync(cancellationToken);
        }

        public async Task<bool> ExistsAsync(long? blockerId, long? blockedId, CancellationToken cancellationToken = default)
        {
            return await context.Set<BloggerBlock>()
                .AnyAsync(bb => bb.BlockerId == blockerId && bb.BlockedId == blockedId, cancellationToken);
        }
    }

}
