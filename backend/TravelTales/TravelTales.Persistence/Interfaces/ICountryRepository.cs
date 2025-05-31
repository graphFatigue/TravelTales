using System.Linq.Expressions;
using TravelTales.Domain.Entities;

namespace TravelTales.Persistence.Interfaces
{
    public interface ICountryRepository
    {
        Task<List<Country>> GetAllAsync(Expression<Func<Country, bool>> predicate, CancellationToken cancellationToken = default);
        Task<Country?> GetByIdAsync(long id, CancellationToken cancellationToken = default);
    }
}
