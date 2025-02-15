using TravelTales.Domain.Entities.Abstract;

namespace TravelTales.Domain.Entities
{
    public class Post : IEntityBase<long>
    {
        public long Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public long BloggerId { get; set; }
        public Blogger Blogger { get; set; }
        public ICollection<Attachment>? Attachments { get; }
        public ICollection<PostLike>? Likes { get; }
        public ICollection<Comment>? Comments { get; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }
        public bool IsDeleted { get; set; }
    }
}
