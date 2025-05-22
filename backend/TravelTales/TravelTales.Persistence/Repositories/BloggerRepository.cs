using Microsoft.EntityFrameworkCore;
using Sieve.Models;
using Sieve.Services;
using System.Linq.Expressions;
using TravelTales.Domain.Entities;
using TravelTales.Persistence.Interfaces;
using TravelTales.Persistence.SharedFiles;

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
                .Include(x => x.City)
                .Include(x => x.Country)
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
                .Include(x => x.City)
                .Include(x => x.Country)
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

        public override async Task<PagedList<Blogger>> GetAllWithFilterAsync(
            SieveModel sieveModel,
            CancellationToken cancellationToken = default)
        {
            // Базовый запрос с включением всех связанных сущностей
            var query = DbSet
                .Where(x => !x.IsDeleted)
                .Include(x => x.User)
                .Include(x => x.Following)
                .Include(x => x.Followers)
                .Include(x => x.City)
                .Include(x => x.Country)
                .Include(x => x.VisitedCities)
                .Include(x => x.VisitedCountries)
                .Include(x => x.Posts)
                .AsQueryable();


            var filteredQuery = sieveProcessor.Apply(sieveModel, query, applyPagination: false);

            // Обработка пагинации
            if (sieveModel.Page != null && sieveModel.PageSize != null)
            {
                filteredQuery = sieveProcessor.Apply(sieveModel, filteredQuery,
                    applyFiltering: false,
                    applySorting: false);
            }

            return await PagedList<Blogger>.ToPagedListAsync(filteredQuery, sieveModel);
        }
    }
}
