using Sieve.Models;
using TravelTales.Application.DTOs.Blogger;
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
    }
}
