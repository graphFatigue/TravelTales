using TravelTales.Application.DTOs.Comment;
using TravelTales.Application.DTOs.Notification;

public class CommentWithNotificationDto
{
    public CommentBroadcastDto Comment { get; set; }
    public NotificationDto Notification { get; set; }
}
