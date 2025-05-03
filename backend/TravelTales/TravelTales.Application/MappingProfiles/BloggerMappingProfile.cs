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
            this.CreateMap<Blogger, BloggerDto>()
                .ForMember(dest => dest.Posts, opt => opt.Ignore());
            this.CreateMap<CreateBloggerDto, Blogger>();
        }
    }
}
