using Microsoft.EntityFrameworkCore;
using Sieve.Models;
using Sieve.Services;
using TravelTales.Domain.Entities;
using TravelTales.Persistence.Interfaces;
using TravelTales.Persistence.SharedFiles;

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

        public override async Task<PagedList<User>> GetAllWithFilterAsync(
            SieveModel sieveModel,
            CancellationToken cancellationToken = default)
        {
            var query = DbSet
                .Where(x => !x.IsDeleted)
                .Include(x => x.Blogger)
                    .ThenInclude(b => b.City)
                .Include(x => x.Blogger)
                    .ThenInclude(b => b.Country)
                .AsQueryable();

            var filteredQuery = sieveProcessor.Apply(sieveModel, query, applyPagination: false);

            if (sieveModel.Page != null && sieveModel.PageSize != null)
            {
                filteredQuery = sieveProcessor.Apply(sieveModel, filteredQuery,
                    applyFiltering: false,
                    applySorting: false);
            }

            return await PagedList<User>.ToPagedListAsync(filteredQuery, sieveModel);
        }
    }
}
