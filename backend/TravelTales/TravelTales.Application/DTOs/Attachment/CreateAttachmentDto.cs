namespace TravelTales.Application.DTOs.Attachment
{
    public class CreateAttachmentDto
    {
        public long PostId { get; set; }
        public string FileLink { get; set; }
    }
}
