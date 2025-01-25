namespace TravelTales.Domain.Entities
{
    public class PostLike
    {
        public long PostId { get; set; }
        public Post Post { get; set; }
        public long BlogerId { get; set; }
        public Bloger Bloger { get; set; }
    }
}
