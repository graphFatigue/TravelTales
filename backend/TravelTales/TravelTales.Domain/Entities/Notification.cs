using TravelTales.Domain.Entities.Abstract;

namespace TravelTales.Domain.Entities
{
    public class Notification : IEntityBase<long>
    {
        public long Id { get; set; }
        public string Message { get; set; }

        // The Blogger receiving the notification
        public long RecipientBloggerId { get; set; }
        public Blogger RecipientBlogger { get; set; }

        // The Blogger triggering the notification (e.g., liking or commenting)
        public long TriggeredByBloggerId { get; set; }
        public Blogger TriggeredByBlogger { get; set; }

        // The post associated with the notification
        public long? PostId { get; set; }
        public Post Post { get; set; }

        // The comment associated with the notification (optional)
        public long? CommentId { get; set; }
        public Comment Comment { get; set; }

        // The post like associated with the notification (optional)
        public long? PostLikeId { get; set; }
        public PostLike PostLike { get; set; }

        // Indicates if the notification has been read by the recipient
        public bool IsRead { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }
        public bool IsDeleted { get; set; }
    }
}
