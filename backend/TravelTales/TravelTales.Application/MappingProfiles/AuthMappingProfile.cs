using AutoMapper;
using TravelTales.Application.DTOs.Auth;
using TravelTales.Domain.Entities;

namespace TravelTales.Application.MappingProfiles
{
    public class AuthMappingProfile : Profile
    {
        public AuthMappingProfile()
        {
            this.CreateMap<SignupDto, User>()
                .ForMember(dest => dest.UserName, src => src.MapFrom(opt => opt.Email));
        }
    }
}
