using AutoMapper;
using TravelTales.Application.DTOs.User;
using TravelTales.Domain.Entities;

namespace TravelTales.Application.MappingProfiles
{
    public class UserMappingProfile : Profile
    {
        public UserMappingProfile()
        {
            //this.CreateMap<User, UserDto>();
            this.CreateMap<User, UserDto>()
                .ForMember(dest => dest.Blogger, opt => opt.MapFrom(src => src.Blogger));
        }
    }
}
