using Microsoft.AspNetCore.Identity;
using TravelTales.Domain.Entities.Abstract;

namespace TravelTales.Domain.Entities
{
    public class Role : IdentityRole<Guid>, IEntityBase<Guid>
    {
        public DateTime? CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }
        public bool IsDeleted { get; set; }
    }
}
