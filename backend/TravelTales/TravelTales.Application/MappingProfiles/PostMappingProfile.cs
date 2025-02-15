using AutoMapper;
using TravelTales.Application.DTOs.Post;
using TravelTales.Domain.Entities;

namespace TravelTales.Application.MappingProfiles
{
    public class PostMappingProfile : Profile
    {
        public PostMappingProfile()
        {
            this.CreateMap<Post, PostDto>();
            this.CreateMap<CreatePostDto, Post>();
        }
    }
}
