using TravelTales.Application.DTOs.Post;

namespace TravelTales.Application.DTOs.Attachment
{
    public class AttachmentDto
    {
        public long Id { get; set; }
        public long PostId { get; set; }
        public int Number { get; set; }
        public string? Uri { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }
        public bool IsDeleted { get; set; }
    }
}
