using TravelTales.Domain.Entities.Abstract;
using TravelTales.Domain.Enums;

namespace TravelTales.Domain.Entities
{
    public class Blogger : IEntityBase<long>
    {
        public long Id { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public DateTime BirthDate { get; set; }
        public Sex Sex { get; set; }
        public string? Bio { get; set; }
        public string? Image { get; set; }
        public Guid UserId { get; set; }
        public User User { get; set; }
        public ICollection<Post>? Posts { get; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }
        public bool IsDeleted { get; set; }
    }
}
