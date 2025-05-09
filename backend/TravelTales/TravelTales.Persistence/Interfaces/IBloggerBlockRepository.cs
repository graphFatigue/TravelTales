using TravelTales.Domain.Entities;

namespace TravelTales.Persistence.Interfaces
{
    public interface IBloggerBlockRepository
    {
        Task<BloggerBlock> GetAsync(long blockerId, long blockedId, CancellationToken cancellationToken = default);

        Task<IEnumerable<long>> GetBlockerIdsAsync(long blockedId, CancellationToken cancellationToken = default);

        Task<IEnumerable<long>> GetBlockedBloggerIdsAsync(long blockerId, CancellationToken cancellationToken = default);

        Task<bool> ExistsAsync(long? blockerId, long? blockedId, CancellationToken cancellationToken = default);

        void Add(BloggerBlock block);
        void Remove(BloggerBlock block);
    }

}
