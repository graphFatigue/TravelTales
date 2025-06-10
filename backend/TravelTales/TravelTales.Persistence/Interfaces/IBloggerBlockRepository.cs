using TravelTales.Domain.Entities;

namespace TravelTales.Persistence.Interfaces
{
    public interface IBloggerBlockRepository
    {
        Task<BloggerBlock> GetAsync(long blockerId, long blockedId);
        Task<IEnumerable<long>> GetBlockedBloggerIdsAsync(long blockerId);
        void Add(BloggerBlock block);
        void Remove(BloggerBlock block);

        Task<IEnumerable<long>> GetBlockerIdsAsync(long blockedId, CancellationToken cancellationToken);

        Task<IEnumerable<long>> GetBlockedBloggerIdsAsync(long blockerId, CancellationToken cancellationToken);

        Task<bool> ExistsAsync(long? blockerId, long? blockedId, CancellationToken cancellationToken);
    }

}
