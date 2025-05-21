using Microsoft.EntityFrameworkCore;
using Sieve.Services;
using System.Linq.Expressions;
using TravelTales.Domain.Entities;
using TravelTales.Persistence.Interfaces;

namespace TravelTales.Persistence.Repositories
{
    public class BloggerRepository : GenericRepository<Blogger, long>, IBloggerRepository
    {
        public BloggerRepository(AppDbContext context, ISieveProcessor sieveProcessor)
            : base(context, sieveProcessor)
        {
        }

        public async Task<Blogger?> GetByIdFullAsync(long id, CancellationToken cancellationToken = default)
        {
            return await this.DbSet
                .Include(x => x.User)
                //.Include(s => s.Posts)
                .Include(x=> x.Following)
                .Include(x => x.Followers)
                .Include(x => x.VisitedCities)
                .Include(x => x.VisitedCountries)
                .FirstOrDefaultAsync(c => c.Id == id, cancellationToken: cancellationToken);
        }

        public async Task<List<Blogger>> GetAllFullAsync(CancellationToken cancellationToken = default)
        {
            return await this.DbSet.Where(x => !x.IsDeleted)
                .Include(x => x.User)
                .Include(s => s.Posts)
                .Include(x => x.Following)
                .Include(x => x.Followers)
                .Include(x => x.VisitedCities)
                .Include(x => x.VisitedCountries)
                .ToListAsync(cancellationToken);
        }

        public override async Task<List<Blogger>> GetAllAsync(
            CancellationToken cancellationToken = default)
                {
                    return await this.DbSet
                        .Where(x => !x.IsDeleted)
                        .Include(x => x.Following)
                        .Include(x => x.Followers)
                        .ToListAsync(cancellationToken);
                }
    }
}
