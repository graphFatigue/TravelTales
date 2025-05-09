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
        public ICollection<long> CategoryIds { get; set; }
        public ICollection<AttachmentDto>? Attachments { get; set; }
        public ICollection<PostLikeDto>? Likes { get; set; }
        public ICollection<CommentDto>? Comments { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }
        public bool IsDeleted { get; set; }
    }
}
