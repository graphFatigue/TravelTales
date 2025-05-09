using Microsoft.EntityFrameworkCore;
using Sieve.Services;
using TravelTales.Domain.Entities;
using TravelTales.Persistence.Interfaces;

namespace TravelTales.Persistence.Repositories
{
    public class BloggerFollowRepository : GenericRepository<BloggerFollow, long>, IBloggerFollowRepository
    {
        public BloggerFollowRepository(AppDbContext context, ISieveProcessor sieveProcessor)
            : base(context, sieveProcessor) { }

        public async Task<bool> ExistsAsync(long followerId, long followingId, CancellationToken cancellationToken = default)
        {
            return await DbSet.AnyAsync(bf =>
                bf.FollowerId == followerId &&
                bf.FollowingId == followingId &&
                !bf.IsDeleted, cancellationToken);
        }

        public async Task RemoveFollowAsync(long followerId, long followingId, CancellationToken cancellationToken = default)
        {
            var follow = await DbSet.FirstOrDefaultAsync(bf =>
                bf.FollowerId == followerId &&
                bf.FollowingId == followingId &&
                !bf.IsDeleted, cancellationToken);

            if (follow != null)
            {
                follow.IsDeleted = true;
                Update(follow);
            }
        }
    }
}