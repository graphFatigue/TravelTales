using TravelTales.Domain.Entities;

namespace TravelTales.Persistence.Interfaces
{
    public interface IUserRepository : IGenericRepository<User, Guid>
    {
    }
}
