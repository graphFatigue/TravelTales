using AutoMapper;
using TravelTales.Application.DTOs.BloggerFollow;
using TravelTales.Domain.Entities;

namespace TravelTales.Application.MappingProfiles
{
    public class BloggerFollowMappingProfile : Profile
    {
        public BloggerFollowMappingProfile()
        {
            CreateMap<BloggerFollow, BloggerFollowDto>()
                .ForMember(dest => dest.CreatedAt,
                    opt => opt.MapFrom(src => src.CreatedAt ?? DateTime.MinValue))
                .ForMember(dest => dest.FollowerName,
                    opt => opt.MapFrom(src => $"{src.Follower.FirstName} {src.Follower.LastName}"))
                .ForMember(dest => dest.FollowerImage,
                    opt => opt.MapFrom(src => src.Follower.Image))
                .ForMember(dest => dest.FollowingName,
                    opt => opt.MapFrom(src => $"{src.Following.FirstName} {src.Following.LastName}"))
                .ForMember(dest => dest.FollowingImage,
                    opt => opt.MapFrom(src => src.Following.Image));
        }
    }
}
