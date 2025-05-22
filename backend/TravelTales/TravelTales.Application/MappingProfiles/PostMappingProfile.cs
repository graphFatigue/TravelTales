using AutoMapper;
using TravelTales.Application.DTOs.Post;
using TravelTales.Domain.Entities;

namespace TravelTales.Application.MappingProfiles
{
    public class PostMappingProfile : Profile
    {
        public PostMappingProfile()
        {
            this.CreateMap<Post, PostDto>()
                //.ForMember(dest => dest.CategoryIds, opt =>
                //    opt.MapFrom(src => src.Categories!.Select(c => c.Id)))
                .ForMember(dest => dest.City, opt => opt.MapFrom(src => src.City))
                .ForMember(dest => dest.Country, opt => opt.MapFrom(src => src.Country));
            this.CreateMap<CreatePostDto, Post>()
                .ForMember(dest => dest.Attachments, opt => opt.Ignore());
            this.CreateMap<Post, PostShortInfoDto>()
                //.ForMember(dest => dest.CategoryIds, opt =>
                //    opt.MapFrom(src => src.Categories!.Select(c => c.Id)))
                .ForMember(dest => dest.City, opt => opt.MapFrom(src => src.City))
                .ForMember(dest => dest.Country, opt => opt.MapFrom(src => src.Country));
        }
    }
}
