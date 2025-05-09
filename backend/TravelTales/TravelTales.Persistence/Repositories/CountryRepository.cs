using Microsoft.EntityFrameworkCore;
using TravelTales.Domain.Entities;
using TravelTales.Persistence.Interfaces;

namespace TravelTales.Persistence.Repositories
{
    public class CountryRepository : ICountryRepository
    {
        protected readonly DbSet<Country> DbSet;

        private readonly AppDbContext context;

        public CountryRepository(AppDbContext context)
        {
            this.context = context;
            this.DbSet = this.context.Set<Country>();
        }

        public async Task<List<Country>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            return await this.DbSet.ToListAsync(cancellationToken);
        }

        public async Task<Country?> GetByIdAsync(long id, CancellationToken cancellationToken = default)
        {
            return await this.DbSet.FirstOrDefaultAsync(x => x.Id.Equals(id), cancellationToken);
        }
    }
}
