using Microsoft.AspNetCore.Http;
using System.Text.Json.Serialization;

namespace TravelTales.Application.DTOs.Blogger
{
    public class UpdateBloggerImageDto
    {
        [JsonIgnore]
        public byte[]? ImageBytes { get; set; }

        public string? Base64Image
        {
            get => null;
            set => ImageBytes = !string.IsNullOrEmpty(value)
                ? Convert.FromBase64String(value.Split(',')[1])
                : null;
        }
        public bool RemoveExisting { get; set; }
    }
}
