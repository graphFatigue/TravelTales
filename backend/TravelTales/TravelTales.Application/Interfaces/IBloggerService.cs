using Sieve.Models;
using TravelTales.Application.DTOs.Blogger;
using TravelTales.Application.DTOs.BloggerFollow;
using TravelTales.Persistence.SharedFiles;

namespace TravelTales.Application.Interfaces
{
    public interface IBloggerService
    {
        Task<IEnumerable<BloggerDto>> GetBloggersAsync(CancellationToken cancellationToken = default);

        Task<BloggerDto?> GetBloggerByIdAsync(long id, CancellationToken cancellationToken = default);

        Task<BloggerDto> CreateBloggerAsync(CreateBloggerDto createBloggerDto, CancellationToken cancellationToken = default);

        Task UpdateBloggerAsync(long id, UpdateBloggerDto updateBloggerDto, CancellationToken cancellationToken = default);

        Task UpdateBloggerImageAsync(long id, UpdateBloggerImageDto updateBloggerImageDto, CancellationToken cancellationToken = default);

        Task DeleteBloggerAsync(long id, CancellationToken cancellationToken = default);

        Task<PagedList<BloggerDto>> GetBloggersWithFilterAsync(SieveModel sieveModel, CancellationToken cancellationToken = default);
        
        Task<long> GetCurrentBloggerId(CancellationToken cancellationToken = default);

        Task FollowBloggerAsync(long followingId, CancellationToken cancellationToken = default);

        Task UnfollowBloggerAsync(long followingId, CancellationToken cancellationToken = default);

        Task<IEnumerable<BloggerFollowDto>> GetFollowersAsync(long bloggerId, CancellationToken cancellationToken = default);

        Task<IEnumerable<BloggerFollowDto>> GetFollowingAsync(long bloggerId, CancellationToken cancellationToken = default);
        Task<PagedList<BloggerFollowDto>> GetFollowersWithFilterAsync(
            long bloggerId,
            SieveModel sieveModel,
            CancellationToken cancellationToken = default);

        Task<PagedList<BloggerFollowDto>> GetFollowingWithFilterAsync(
            long bloggerId,
            SieveModel sieveModel,
            CancellationToken cancellationToken = default);

        Task<BloggerStatsDto> GetBloggerStatsAsync(long bloggerId, CancellationToken cancellationToken = default);
    }
}
