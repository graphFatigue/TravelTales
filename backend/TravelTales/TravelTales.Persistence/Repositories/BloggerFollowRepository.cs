using Microsoft.EntityFrameworkCore;
using Sieve.Models;
using Sieve.Services;
using TravelTales.Domain.Entities;
using TravelTales.Persistence.Interfaces;
using TravelTales.Persistence.SharedFiles;

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

        public async Task<PagedList<BloggerFollow>> GetFollowersWithFilterAsync(
            long bloggerId,
            SieveModel sieveModel,
            CancellationToken cancellationToken = default)
        {
            var query = DbSet
                .Include(bf => bf.Follower)
                .Include(bf => bf.Following)
                .Where(bf => bf.FollowingId == bloggerId && !bf.IsDeleted);
                //.OrderByDescending(bf => bf.CreatedAt);

            return await ToFilteredPagedListAsync(query, sieveModel, cancellationToken);
        }

        public async Task<PagedList<BloggerFollow>> GetFollowingWithFilterAsync(
            long bloggerId,
            SieveModel sieveModel,
            CancellationToken cancellationToken = default)
        {
            var query = DbSet
                .Include(bf => bf.Follower)
                .Include(bf => bf.Following)
                .Where(bf => bf.FollowerId == bloggerId && !bf.IsDeleted);
                //.OrderByDescending(bf => bf.CreatedAt);

            return await ToFilteredPagedListAsync(query, sieveModel, cancellationToken);
        }

        private async Task<PagedList<BloggerFollow>> ToFilteredPagedListAsync(
            IQueryable<BloggerFollow> query,
            SieveModel sieveModel,
            CancellationToken cancellationToken)
        {
            var filteredQuery = sieveProcessor.Apply(sieveModel, query, applyPagination: false);
            return await PagedList<BloggerFollow>.ToPagedListAsync(filteredQuery, sieveModel);
        }
    }
}