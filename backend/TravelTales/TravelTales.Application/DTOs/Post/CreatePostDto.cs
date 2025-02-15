namespace TravelTales.Application.DTOs.Post
{
    public class CreatePostDto
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public long BloggerId { get; set; }
        public byte[]?[]? FilesBytes { get; set; }
    }
}
