using TravelTales.Domain.Entities.Abstract;

namespace TravelTales.Domain.Entities
{
    public class BloggerFollow : IEntityBase<long>
    {
        public long Id { get; set; }
        public long FollowerId { get; set; }
        public Blogger Follower { get; set; }
        public long FollowingId { get; set; }
        public Blogger Following { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }
        public bool IsDeleted { get; set; }
    }
}