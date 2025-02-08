using Sieve.Models;
using TravelTales.Application.DTOs.Blogger;
using TravelTales.Application.Interfaces;
using TravelTales.Persistence.SharedFiles;

namespace TravelTales.Application.Services
{
    public class BloggerService : IBloggerService
    {
        public Task<BloggerDto> CreateBloggerAsync(CreateBloggerDto createBloggerDto, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }

        public Task DeleteBloggerAsync(long id, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }

        public Task<BloggerDto?> GetBloggerByIdAsync(long id, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<BloggerDto>> GetBloggersAsync(CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }

        public Task<PagedList<BloggerDto>> GetBloggersWithFilterAsync(SieveModel sieveModel, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }

        public Task UpdateBloggerAsync(long id, UpdateBloggerDto updateBloggerDto, CancellationToken cancellationToken = default)
        {
            throw new NotImplementedException();
        }
    }
}
