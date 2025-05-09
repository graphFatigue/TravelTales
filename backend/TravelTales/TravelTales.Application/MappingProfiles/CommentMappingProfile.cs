using AutoMapper;
using TravelTales.Application.DTOs.Comment;
using TravelTales.Domain.Entities;

namespace TravelTales.Application.MappingProfiles
{
    public class CommentMappingProfile : Profile
    {
        public CommentMappingProfile()
        {
            this.CreateMap<Comment, CommentDto>();
            this.CreateMap<CreateCommentDto, Comment>();
        }
    }
}
