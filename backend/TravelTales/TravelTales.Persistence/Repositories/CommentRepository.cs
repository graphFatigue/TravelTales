using Microsoft.EntityFrameworkCore;
using Sieve.Services;
using TravelTales.Domain.Entities;
using TravelTales.Persistence.Interfaces;

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
    }

}
