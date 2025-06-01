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

        // property for MIME type detection
        [JsonIgnore]
        public string? MimeType { get; set; }

        public string? Base64Attachment
        {
            get => null;
            set
            {
                if (string.IsNullOrEmpty(value))
                {
                    AttachmentBytes = null;
                    MimeType = null;
                    return;
                }

                // Detect MIME type from base64 prefix
                if (value.StartsWith("data:video/"))
                {
                    MimeType = value.Split(';')[0].Split('/')[1];
                }
                else if (value.StartsWith("data:image/"))
                {
                    MimeType = value.Split(';')[0].Split('/')[1];
                }
                else
                {
                    MimeType = "jpeg"; // Default to jpeg
                }

                AttachmentBytes = !string.IsNullOrEmpty(value)
                    ? Convert.FromBase64String(value.Split(',')[1])
                    : null;
            }
        }
    }
}