using TravelTales.Domain.Entities.Abstract;

namespace TravelTales.Domain.Entities
{
    public class Category : IEntityBase<long>
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public ICollection<Post>? Posts { get; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }
        public bool IsDeleted { get; set; }
    }
}
