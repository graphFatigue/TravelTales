using TravelTales.Application.DTOs.Attachment;

namespace TravelTales.Application.DTOs.Post
{
    public class UpdatePostDto
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public ICollection<AttachmentDto>? Attachments { get; }
    }
}
