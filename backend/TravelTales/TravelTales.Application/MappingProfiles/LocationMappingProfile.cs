using AutoMapper;
using TravelTales.Application.DTOs.City;
using TravelTales.Application.DTOs.Country.TravelTales.Application.DTOs.Location;
using TravelTales.Domain.Entities;

namespace TravelTales.Application.MappingProfiles
{
    public class LocationMappingProfile : Profile
    {
        public LocationMappingProfile()
        {
            CreateMap<Country, CountryDto>();
            CreateMap<City, CityDto>();
        }
    }
}
