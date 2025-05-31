using TravelTales.Domain.Entities;

namespace TravelTales.Persistence.Interfaces
{
    public interface ICityRepository
    {
        Task<List<City>> GetAllByCountryIdAsync(long countryId, CancellationToken cancellationToken = default);
        Task<City?> GetByIdAsync(long id, CancellationToken cancellationToken = default);

        Task<List<City>> GetByIdsAsync(IEnumerable<long> cityIds, CancellationToken cancellationToken = default);
    }
}
