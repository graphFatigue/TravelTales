using TravelTales.Application.DTOs.Attachment;

namespace TravelTales.Application.Interfaces
{
    public interface IAttachmentService
    {
        Task<AttachmentDto> UploadAttachmentAsync(UploadAttachmentDto uploadAttachmentDto, CancellationToken cancellationToken = default);
        Task DeleteAttachmentAsync(long id, CancellationToken cancellationToken = default);
    }
}
