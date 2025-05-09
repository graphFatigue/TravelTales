using TravelTales.Application.DTOs.Attachment;

namespace TravelTales.Application.DTOs.Post
{
    public class CreatePostDto
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public long BloggerId { get; set; }
        public ICollection<long> CategoryIds { get; set; }
        public ICollection<UploadAttachmentDto>? Attachments { get; set; }
    }
}
