using TravelTales.Application.DTOs.Attachment;

namespace TravelTales.Application.DTOs.Post
{
    public class UpdatePostDto
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public long? CityId { get; set; }
        public long? CountryId { get; set; }
        public ICollection<long> CategoryIds { get; set; }
        public ICollection<UploadAttachmentDto>? NewAttachments { get; set; }
        public ICollection<long>? AttachmentsToDelete { get; set; }
    }
}
