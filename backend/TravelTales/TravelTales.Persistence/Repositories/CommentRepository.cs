using Microsoft.EntityFrameworkCore;
using Sieve.Models;
using Sieve.Services;
using TravelTales.Domain.Entities;
using TravelTales.Persistence.Interfaces;
using TravelTales.Persistence.SharedFiles;

namespace TravelTales.Persistence.Repositories
{
    public class CommentRepository : GenericRepository<Comment, long>, ICommentRepository
    {
        public CommentRepository(AppDbContext context, ISieveProcessor sieveProcessor)
            : base(context, sieveProcessor)
        {
        }

        public async Task<List<Comment>> GetCommentsByPostIdAsync(long postId)
        {
            return await this.DbSet
                .Include(c => c.Blogger)
                .Where(c => c.PostId == postId && !c.IsDeleted)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();
        }

        public override void Delete(Comment comment)
        {
            // Delete notifications related to this comment first
            var notifications = this.context.Notifications
                .Where(n => n.CommentId == comment.Id)
                .ToList();

            this.context.Notifications.RemoveRange(notifications);

            // Then delete the comment
            base.Delete(comment);
        }

        public override async Task<PagedList<Comment>> GetAllWithFilterAsync(
            SieveModel sieveModel,
            CancellationToken cancellationToken = default)
        {

            // Base query with includes for navigation properties
            var query = DbSet
                .Where(x => !x.IsDeleted)
                .Include(s => s.Blogger)
                .AsQueryable();

            //// Apply Sieve filters/sorts
            //var filteredQuery = sieveProcessor.Apply(sieveModel, query, applyPagination: false);

            //// Apply pagination if needed
            //if (sieveModel.Page != null && sieveModel.PageSize != null)
            //{
            //    filteredQuery = sieveProcessor.Apply(sieveModel, filteredQuery, applyFiltering: false, applySorting: false);
            //}

            return await PagedList<Comment>.ToPagedListAsync(query, sieveModel);
        }
    }

}
