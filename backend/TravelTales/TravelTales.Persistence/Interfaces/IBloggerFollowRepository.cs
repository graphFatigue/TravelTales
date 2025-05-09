using TravelTales.Domain.Entities;
using TravelTales.Persistence.Interfaces;

namespace TravelTales.Persistence.Repositories
{
    public interface IBloggerFollowRepository : IGenericRepository<BloggerFollow, long>
    {
        Task<bool> ExistsAsync(long followerId, long followingId, CancellationToken cancellationToken = default);
        Task RemoveFollowAsync(long followerId, long followingId, CancellationToken cancellationToken = default);
    }
}