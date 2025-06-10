using TravelTales.Domain.Entities;

namespace TravelTales.Persistence.Interfaces
{
    public interface IBloggerRepository : IGenericRepository<Blogger, long>
    {
        Task<Blogger?> GetByIdFullAsync(long id, CancellationToken cancellationToken = default);

        Task<List<Blogger>> GetAllFullAsync(CancellationToken cancellationToken = default);
    }
}
