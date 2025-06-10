using TravelTales.Domain.Entities;

namespace TravelTales.Persistence.Interfaces
{
    public interface ICategoryRepository : IGenericRepository<Category, long>
    {
    }
}
