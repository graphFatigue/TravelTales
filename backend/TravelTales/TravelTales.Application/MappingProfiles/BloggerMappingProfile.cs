using AutoMapper;
using TravelTales.Application.DTOs.Blogger;
using TravelTales.Domain.Entities;

namespace TravelTales.Application.MappingProfiles
{
    public class BloggerMappingProfile : Profile
    {
        public BloggerMappingProfile()
        {
            //this.CreateMap<Blogger, BloggerDto>();
            CreateMap<Blogger, BloggerDto>()
            //.ForMember(dest => dest.Posts, opt => opt.Ignore())
            .ForMember(dest => dest.FollowerCount, opt => opt.MapFrom(src => src.Followers.Count))
            .ForMember(dest => dest.FollowingCount, opt => opt.MapFrom(src => src.Following.Count))
            .ForMember(dest => dest.IsFollowing, opt => opt.Ignore());
            this.CreateMap<CreateBloggerDto, Blogger>();

            CreateMap<Blogger, BloggerShortInfoDto>()
                .ForMember(dest => dest.FollowerCount, opt => opt.MapFrom(src => src.Followers.Count))
                .ForMember(dest => dest.FollowingCount, opt => opt.MapFrom(src => src.Following.Count))
                .ForMember(dest => dest.IsFollowing, opt => opt.Ignore());
        }
    }
}
