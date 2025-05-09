using AutoMapper;
using TravelTales.Application.DTOs.City;
using TravelTales.Application.DTOs.Country.TravelTales.Application.DTOs.Location;
using TravelTales.Application.Interfaces;
using TravelTales.Persistence.Interfaces;

namespace TravelTales.Application.Services
{
    public class LocationService : ILocationService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public LocationService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<CountryDto>> GetAllCountriesAsync(CancellationToken cancellationToken = default)
        {
            var countries = await _unitOfWork.GetRepository<ICountryRepository>()
                .GetAllAsync(cancellationToken);

            return _mapper.Map<IEnumerable<CountryDto>>(countries);
        }

        public async Task<IEnumerable<CityDto>> GetCitiesByCountryAsync(long countryId, CancellationToken cancellationToken = default)
        {
            var cities = await _unitOfWork.GetRepository<ICityRepository>()
                .GetAllByCountryIdAsync(countryId, cancellationToken);

            return _mapper.Map<IEnumerable<CityDto>>(cities);
        }
    }
}