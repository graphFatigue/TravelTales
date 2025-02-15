using AutoMapper;
using TravelTales.Application.DTOs.Notification;
using TravelTales.Domain.Entities;

namespace TravelTales.Application.MappingProfiles
{
    public class NotificationMappingProfile : Profile
    {
        public NotificationMappingProfile()
        {
            this.CreateMap<Notification, NotificationDto>();
            //this.CreateMap<CreateNotificationDto, Notification>();
        }
    }
}
