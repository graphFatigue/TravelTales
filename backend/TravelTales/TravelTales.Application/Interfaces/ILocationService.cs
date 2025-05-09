using TravelTales.Application.DTOs.City;
using TravelTales.Application.DTOs.Country.TravelTales.Application.DTOs.Location;

namespace TravelTales.Application.Interfaces
{
    public interface ILocationService
    {
        Task<IEnumerable<CountryDto>> GetAllCountriesAsync(CancellationToken cancellationToken = default);

        Task<IEnumerable<CityDto>> GetCitiesByCountryAsync(long countryId, CancellationToken cancellationToken = default);
    }
}
