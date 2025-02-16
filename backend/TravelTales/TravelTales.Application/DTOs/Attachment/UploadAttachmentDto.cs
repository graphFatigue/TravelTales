namespace TravelTales.Application.DTOs.Attachment
{
    public class UploadAttachmentDto
    {
        public long PostId { get; set; }
        public int Number { get; set; }
        public byte[]? AttachmentBytes { get; set; }
    }
}
