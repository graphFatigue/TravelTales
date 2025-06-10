using AutoMapper;
using TravelTales.Application.DTOs.Notification;
using TravelTales.Domain.Entities;

namespace TravelTales.Application.MappingProfiles
{
    public class NotificationMappingProfile : Profile
    {
        public NotificationMappingProfile()
        {
            CreateMap<Notification, NotificationDto>()
                .ForMember(dest => dest.TriggeredByBlogger, opt => opt.MapFrom(src => src.TriggeredByBlogger))
                .ForMember(dest => dest.RecipientBlogger, opt => opt.MapFrom(src => src.RecipientBlogger));

            CreateMap<CreateNotificationDto, Notification>()
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(_ => DateTime.UtcNow));
        }
    }
}
