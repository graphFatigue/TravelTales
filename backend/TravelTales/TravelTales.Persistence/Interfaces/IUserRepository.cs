using TravelTales.Domain.Entities;

namespace TravelTales.Persistence.Interfaces
{
    public interface IUserRepository : IGenericRepository<User, Guid>
    {
        Task<User?> GetByIdFullAsync(Guid id, CancellationToken cancellationToken = default);
    }
}
