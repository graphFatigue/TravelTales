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
            this.CreateMap<Comment, CommentBroadcastDto>()
                .ForMember(dest => dest.BloggerName, opt =>
                    opt.MapFrom(src => $"{src.Blogger.FirstName} {src.Blogger.LastName}"))
                .ForMember(dest => dest.BloggerImage, opt => opt.MapFrom(src => src.Blogger.Image))
                .ForMember(dest => dest.PostAuthorBloggerId, opt => opt.MapFrom(src => src.Post.BloggerId));
        }
    }
}
