using Microsoft.EntityFrameworkCore;
using TravelTales.Domain.Entities;
using TravelTales.Persistence.Interfaces;

namespace TravelTales.Persistence.Repositories
{
    public class CityRepository : ICityRepository
    {
        protected readonly DbSet<City> DbSet;

        private readonly AppDbContext context;

        public CityRepository(AppDbContext context)
        {
            this.context = context;
            this.DbSet = this.context.Set<City>();
        }

        public async Task<List<City>> GetAllByCountryIdAsync(long countryId, CancellationToken cancellationToken = default)
        {
            return await this.DbSet.Where(x => x.CountryId == countryId).ToListAsync(cancellationToken);
        }

        public async Task<City?> GetByIdAsync(long id, CancellationToken cancellationToken = default)
        {
            return await this.DbSet.FirstOrDefaultAsync(x => x.Id.Equals(id), cancellationToken);
        }
    }
}
