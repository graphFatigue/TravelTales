using AutoMapper;

using TravelTales.Application.DTOs.PostLike;
using TravelTales.Domain.Entities;

namespace TravelTales.Application.MappingProfiles
{
    public class PostLikeMappingProfile : Profile
    {
        public PostLikeMappingProfile()
        {
            this.CreateMap<PostLike, PostLikeDto>();
            this.CreateMap<CreatePostLikeDto, PostLike>();
        }
    }
}
