using AutoMapper;
using TravelTales.Application.DTOs.Attachment;
using TravelTales.Domain.Entities;

namespace TravelTales.Application.MappingProfiles
{
    public class AttachmentMappingProfile : Profile
    {
        public AttachmentMappingProfile()
        {
            this.CreateMap<Attachment, AttachmentDto>();
            this.CreateMap<CreateAttachmentDto, Attachment>();
        }
    }
}
