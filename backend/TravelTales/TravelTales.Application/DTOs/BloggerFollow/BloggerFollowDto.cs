namespace TravelTales.Application.DTOs.BloggerFollow
{
    public class BloggerFollowDto
    {
        public long FollowerId { get; set; }
        public string FollowerName { get; set; }
        public string? FollowerImage { get; set; }
        public long FollowingId { get; set; }
        public string FollowingName { get; set; }
        public string? FollowingImage { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}