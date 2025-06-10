using Sieve.Models;
using TravelTales.Domain.Entities;
using TravelTales.Persistence.Interfaces;
using TravelTales.Persistence.SharedFiles;

namespace TravelTales.Persistence.Repositories
{
    public interface IBloggerFollowRepository : IGenericRepository<BloggerFollow, long>
    {
        Task<bool> ExistsAsync(long followerId, long followingId, CancellationToken cancellationToken = default);
        Task RemoveFollowAsync(long followerId, long followingId, CancellationToken cancellationToken = default);

        Task<PagedList<BloggerFollow>> GetFollowersWithFilterAsync(
            long bloggerId,
            SieveModel sieveModel,
            CancellationToken cancellationToken = default);

        Task<PagedList<BloggerFollow>> GetFollowingWithFilterAsync(
            long bloggerId,
            SieveModel sieveModel,
            CancellationToken cancellationToken = default);
    }
}