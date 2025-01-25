using TravelTales.Domain.Entities.Abstract;

namespace TravelTales.Domain.Entities
{
    public class Post : IEntityBase<long>
    {
        public long Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public long BlogerId { get; set; }
        public Bloger Bloger { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }
        public bool IsDeleted { get; set; }
    }
}
