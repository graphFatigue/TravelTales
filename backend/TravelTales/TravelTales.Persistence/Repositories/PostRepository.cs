using Microsoft.EntityFrameworkCore;
using Sieve.Services;
using TravelTales.Domain.Entities;
using TravelTales.Persistence.Interfaces;

namespace TravelTales.Persistence.Repositories
{
    public class PostRepository : GenericRepository<Post, long>, IPostRepository
    {
        public PostRepository(AppDbContext context, ISieveProcessor sieveProcessor)
            : base(context, sieveProcessor)
        {
        }

        public async Task<List<Post>> GetAllFullAsync(CancellationToken cancellationToken = default)
        {
            return await this.DbSet.Where(x => !x.IsDeleted)
                .Include(x => x.Likes)
                .Include(s => s.Blogger)
                .ToListAsync(cancellationToken);
        }

        public async Task<Post?> GetByIdFullAsync(long id, CancellationToken cancellationToken = default)
        {
            return await this.DbSet
                .Include(x => x.Likes)
                .Include(s => s.Blogger)
                .FirstOrDefaultAsync(c => c.Id == id, cancellationToken: cancellationToken);
        }
    }
}
