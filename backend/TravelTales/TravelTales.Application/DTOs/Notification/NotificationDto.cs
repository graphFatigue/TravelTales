using TravelTales.Application.DTOs.Blogger;

namespace TravelTales.Application.DTOs.Notification
{
    public class NotificationDto
    {
        public long Id { get; set; }
        public string Message { get; set; }
        public long RecipientBloggerId { get; set; }
        public BloggerDto RecipientBlogger { get; set; }
        public long? TriggeredByBloggerId { get; set; }
        public BloggerDto TriggeredByBlogger { get; set; }
        public long? PostId { get; set; }
        public long? LikeId { get; set; }
        public long? CommentId { get; set; }
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
