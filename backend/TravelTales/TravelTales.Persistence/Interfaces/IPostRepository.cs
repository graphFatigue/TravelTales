using TravelTales.Domain.Entities;

namespace TravelTales.Persistence.Interfaces
{
    public interface IPostRepository : IGenericRepository<Post, long>
    {
        Task<Post?> GetByIdFullAsync(long id, CancellationToken cancellationToken = default);

        Task<List<Post>> GetAllFullAsync(CancellationToken cancellationToken = default);
    }
}
