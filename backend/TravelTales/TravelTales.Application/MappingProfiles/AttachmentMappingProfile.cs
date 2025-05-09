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

            this.CreateMap<UploadAttachmentDto, Attachment>()
              .ForMember(dest => dest.Uri, opt => opt.Ignore())  // Will be set later
              .ForMember(dest => dest.Id, opt => opt.Ignore())
              .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
              .ForMember(dest => dest.ModifiedAt, opt => opt.Ignore())
              .ForMember(dest => dest.IsDeleted, opt => opt.Ignore());
        }
    }
}
