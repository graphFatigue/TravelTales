namespace TravelTales.Domain.Entities
{
    public class BloggerBlock
    {
        // The user who initiates the block
        public long BlockerId { get; set; }
        public Blogger? Blocker { get; set; }

        // The user who is being blocked
        public long BlockedId { get; set; }
        public Blogger? Blocked { get; set; }
    }

}
