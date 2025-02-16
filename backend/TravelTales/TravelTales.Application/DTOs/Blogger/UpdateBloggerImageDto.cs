namespace TravelTales.Application.DTOs.Blogger
{
    public class UpdateBloggerImageDto
    {
        public byte[]? ImageBytes { get; set; }
        public bool RemoveExisting { get; set; }
    }
}
