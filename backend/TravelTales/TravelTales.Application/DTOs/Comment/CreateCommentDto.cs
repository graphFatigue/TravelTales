using TravelTales.Application.DTOs.Blogger;
using TravelTales.Application.DTOs.Post;

namespace TravelTales.Application.DTOs.Comment
{
    public class CreateCommentDto
    {
        public string Content { get; set; }
        public long PostId { get; set; }
        public long BloggerId { get; set; }
    }
}
