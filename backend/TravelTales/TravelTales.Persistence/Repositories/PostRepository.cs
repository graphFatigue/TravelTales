using Microsoft.EntityFrameworkCore;
using Sieve.Models;
using Sieve.Services;
using System.Linq.Expressions;
using TravelTales.Domain.Entities;
using TravelTales.Persistence.Interfaces;
using TravelTales.Persistence.SharedFiles;

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
                .Include(p => p.Categories)
                .ToListAsync(cancellationToken);
        }

        public async Task<Post?> GetByIdFullAsync(long id, CancellationToken cancellationToken = default)
        {
            return await this.DbSet
                .Include(x => x.Likes)
                .Include(s => s.Blogger)
                .Include(p => p.Categories)
                //.Include(p => p.Comments)
                .Include(p => p.Country)
                .Include(p => p.City)
                //.Include(p => p.Tags)
                .Include(p => p.Attachments)
                .FirstOrDefaultAsync(c => c.Id == id, cancellationToken: cancellationToken);
        }

        public async Task<List<Post>> GetAllFullAsync(
            Expression<Func<Post, bool>> predicate = null,
            CancellationToken cancellationToken = default)
        {
            IQueryable<Post> query = this.DbSet
                .Where(x => !x.IsDeleted)
                .Include(x => x.Likes)
                .Include(s => s.Blogger)
                .Include(p => p.Categories)
                //.Include(p => p.Comments)
                .Include(p => p.Country)
                .Include(s => s.Attachments)
                .Include(p => p.City);

            if (predicate != null)
            {
                query = query.Where(predicate);
            }

            return await query.ToListAsync(cancellationToken);
        }

        public override async Task<PagedList<Post>> GetAllWithFilterAsync(
            SieveModel sieveModel,
            CancellationToken cancellationToken = default)
        {
            //ValidateGetAllWithFilterParameters(sieveModel);

            // Base query with includes for navigation properties
            var query = DbSet
                .Where(x => !x.IsDeleted)
                .Include(p => p.Country)  // Include Country
                .Include(p => p.City)     // Include City
                .Include(p => p.Categories)
                .Include(s => s.Blogger)
                .Include(s => s.Attachments)
                .Include(s => s.Likes)
                //.Include(s => s.Comments)
                .AsQueryable();

            // Apply Sieve filters/sorts
            var filteredQuery = sieveProcessor.Apply(sieveModel, query, applyPagination: false);

            //// Apply pagination if needed
            //if (sieveModel.Page != null && sieveModel.PageSize != null)
            //{
            //    filteredQuery = sieveProcessor.Apply(sieveModel, filteredQuery, applyFiltering: false, applySorting: false);
            //}

            return await PagedList<Post>.ToPagedListAsync(filteredQuery, sieveModel);
        }
    }
}
