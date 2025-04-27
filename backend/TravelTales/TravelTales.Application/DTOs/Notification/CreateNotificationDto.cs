namespace TravelTales.Application.DTOs.Notification
{
    public class CreateNotificationDto
    {
        public string Message { get; set; }
        public long RecipientBloggerId { get; set; }
        public long? TriggeredByBloggerId { get; set; }
        public long? PostId { get; set; }
        public long? CommentId { get; set; }
        public long? LikedPostId { get; set; }
        public long? LikedBloggerId { get; set; }
    }
}
