namespace TravelTales.Domain.Entities
{
    public class PostLike
    {
        public long Id { get; set; }
        public long PostId { get; set; }
        public Post Post { get; set; }
        public long BloggerId { get; set; }
        public Blogger Blogger { get; set; }
        public Notification Notification { get; set; }
    }
}