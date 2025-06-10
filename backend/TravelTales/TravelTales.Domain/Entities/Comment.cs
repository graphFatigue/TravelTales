using TravelTales.Domain.Entities.Abstract;

namespace TravelTales.Domain.Entities
{
    public class Comment : IEntityBase<long>
    {
        public long Id { get; set; }
        public string Content { get; set; }
        public long PostId { get; set; }
        public Post Post { get; set; }
        public long? BloggerId { get; set; }
        public Blogger Blogger { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }
        public bool IsDeleted { get; set; }
    }
}