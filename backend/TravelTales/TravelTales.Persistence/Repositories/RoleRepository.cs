using Sieve.Services;
using TravelTales.Domain.Entities;
using TravelTales.Persistence.Interfaces;

namespace TravelTales.Persistence.Repositories
{
    public class RoleRepository : GenericRepository<Role, Guid>, IRoleRepository
    {
        public RoleRepository(AppDbContext context, ISieveProcessor sieveProcessor)
            : base(context, sieveProcessor)
        {
        }
    }
}
