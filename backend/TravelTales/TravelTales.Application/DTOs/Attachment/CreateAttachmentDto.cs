namespace TravelTales.Application.DTOs.Attachment
{
    public class CreateAttachmentDto
    {
        public long PostId { get; set; }
        public int Number { get; set; }
        public string? Uri { get; set; }
    }
}
