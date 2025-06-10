using TravelTales.Application.DTOs.BloggerBlock;

namespace TravelTales.Application.Interfaces
{
    public interface IBloggerBlockService
    {
        Task BlockBloggerAsync(BlockBloggerDto dto);
        Task UnblockBloggerAsync(UnblockBloggerDto dto);
        Task<bool> IsBlockedAsync(long blockerId, long blockedId);
        Task<IEnumerable<long>> GetBlockedBloggerIdsAsync(long blockerId);
    }

}
