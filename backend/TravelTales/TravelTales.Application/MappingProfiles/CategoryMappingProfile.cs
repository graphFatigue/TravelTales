using AutoMapper;
using TravelTales.Application.DTOs.Category;
using TravelTales.Domain.Entities;

namespace TravelTales.Application.MappingProfiles
{
    public class CategoryMappingProfile : Profile
    {
        public CategoryMappingProfile()
        {
            this.CreateMap<Category, CategoryDto>();
            this.CreateMap<CreateCategoryDto, Category>()
                .ForMember(dest => dest.Posts, opt => opt.Ignore());
        }
    }
}
