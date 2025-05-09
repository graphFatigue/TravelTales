namespace TravelTales.Application.DTOs.BloggerFollow
{
    public class BloggerFollowDto
    {
        public long FollowerId { get; set; }
        public long FollowingId { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
