using Microsoft.EntityFrameworkCore;
using Sieve.Services;
using TravelTales.Domain.Entities;
using TravelTales.Persistence.Interfaces;

namespace TravelTales.Persistence.Repositories
{
    public class UserRepository : GenericRepository<User, Guid>, IUserRepository
    {
        public UserRepository(AppDbContext context, ISieveProcessor sieveProcessor)
            : base(context, sieveProcessor)
        {
        }

        public async Task<User?> GetByIdFullAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return await this.DbSet
                .Include(x => x.Blogger)
                .FirstOrDefaultAsync(c => c.Id == id, cancellationToken: cancellationToken);
        }
    }
}
