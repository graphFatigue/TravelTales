using Microsoft.AspNetCore.Mvc;
using TravelTales.Application.DTOs.City;
using TravelTales.Application.DTOs.Country.TravelTales.Application.DTOs.Location;
using TravelTales.Application.Interfaces;

namespace TravelTales.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LocationsController : ControllerBase
    {
        private readonly ILocationService locationService;

        public LocationsController(ILocationService locationService)
        {
            this.locationService = locationService;
        }

        [HttpGet("countries")]
        public async Task<ActionResult<IEnumerable<CountryDto>>> GetCountries(CancellationToken cancellationToken)
        {
            var countries = await this.locationService.GetAllCountriesAsync(cancellationToken);
            return Ok(countries);
        }

        [HttpGet("countries/{countryId}/cities")]
        public async Task<ActionResult<IEnumerable<CityDto>>> GetCitiesByCountry(
            long countryId,
            CancellationToken cancellationToken)
        {
            var cities = await this.locationService.GetCitiesByCountryAsync(countryId, cancellationToken);
            return Ok(cities);
        }
    }
}
