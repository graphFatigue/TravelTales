using TravelTales.Application.DTOs.Blogger;
using TravelTales.Application.DTOs.Post;

namespace TravelTales.Application.DTOs.Comment
{
    public class CommentDto
    {
        public long Id { get; set; }
        public string Content { get; set; }
        public long PostId { get; set; }
        public PostDto Post { get; set; }
        public long BloggerId { get; set; }
        public BloggerDto Blogger { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }
        public bool IsDeleted { get; set; }
    }
}
