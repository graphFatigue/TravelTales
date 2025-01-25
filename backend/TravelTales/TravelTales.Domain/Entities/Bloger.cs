using TravelTales.Domain.Entities.Abstract;
using TravelTales.Domain.Enums;

namespace TravelTales.Domain.Entities
{
    public class Bloger : IEntityBase<long>
    {
        public long Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime BirthDate { get; set; }
        public Sex Sex { get; set; }
        public string Bio { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }
        public bool IsDeleted { get; set; }
    }
}
