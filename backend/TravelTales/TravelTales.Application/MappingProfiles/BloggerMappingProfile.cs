using AutoMapper;
using TravelTales.Application.DTOs.Blogger;
using TravelTales.Domain.Entities;

namespace TravelTales.Application.MappingProfiles
{
    public class BloggerMappingProfile : Profile
    {
        public BloggerMappingProfile()
        {
            this.CreateMap<Blogger, BloggerDto>();
            this.CreateMap<CreateBloggerDto, Blogger>();
        }
    }
}
