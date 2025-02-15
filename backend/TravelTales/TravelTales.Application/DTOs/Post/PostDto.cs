using TravelTales.Application.DTOs.Attachment;
using TravelTales.Application.DTOs.Blogger;
using TravelTales.Application.DTOs.Comment;
using TravelTales.Application.DTOs.PostLike;

namespace TravelTales.Application.DTOs.Post
{
    public class PostDto
    {
        public long Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public long BloggerId { get; set; }
        public BloggerDto Blogger { get; set; }
        public ICollection<AttachmentDto>? Attachments { get; }
        public ICollection<PostLikeDto>? Likes { get; }
        public ICollection<CommentDto>? Comments { get; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }
        public bool IsDeleted { get; set; }
    }
}
