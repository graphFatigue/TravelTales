using System.Text.Json.Serialization;

namespace TravelTales.Application.DTOs.Attachment
{
    public class UploadAttachmentDto
    {
        [JsonIgnore]
        public long PostId { get; set; } = 0;

        public int Number { get; set; }

        [JsonIgnore]
        public byte[]? AttachmentBytes { get; set; }

        public string? Base64Attachment
        {
            get => null;
            set => AttachmentBytes = !string.IsNullOrEmpty(value)
                ? Convert.FromBase64String(value.Split(',')[1])
                : null;
        }
    }
}
