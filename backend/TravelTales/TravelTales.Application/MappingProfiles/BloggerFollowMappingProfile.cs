using AutoMapper;
using TravelTales.Application.DTOs.BloggerFollow;
using TravelTales.Domain.Entities;

namespace TravelTales.Application.MappingProfiles
{
    public class BloggerFollowMappingProfile : Profile
    {
        public BloggerFollowMappingProfile()
        {
            CreateMap<BloggerFollow, BloggerFollowDto>();
                //.ForMember(dest => dest.CreatedAt,
                //    opt => opt.MapFrom(src => src.CreatedAt ?? DateTime.MinValue));
        }
    }
}
