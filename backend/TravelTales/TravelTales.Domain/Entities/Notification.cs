using TravelTales.Domain.Entities.Abstract;

namespace TravelTales.Domain.Entities
{
    public class Notification : IEntityBase<long>
    {
        public long Id { get; set; }
        public string Message { get; set; }
        public long RecipientBloggerId { get; set; }
        public Blogger RecipientBlogger { get; set; }
        public long TriggeredByBloggerId { get; set; }
        public Blogger TriggeredByBlogger { get; set; }
        public long? PostId { get; set; }
        public Post Post { get; set; }
        public long? CommentId { get; set; }
        public Comment Comment { get; set; }
        public long? PostLikeId { get; set; }
        public PostLike PostLike { get; set; }
        public bool IsRead { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }
        public bool IsDeleted { get; set; }
    }
}
