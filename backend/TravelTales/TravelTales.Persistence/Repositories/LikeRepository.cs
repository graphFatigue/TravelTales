using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using TravelTales.Domain.Entities;
using TravelTales.Persistence.Interfaces;

namespace TravelTales.Persistence.Repositories
{
    public class LikeRepository : ILikeRepository
    {
        private readonly AppDbContext context;

        public LikeRepository(AppDbContext context)
        {
            this.context = context;
        }

        public async Task AddLikeAsync(PostLike postLike)
        {
            this.context.PostLikes.Add(postLike);
            await this.context.SaveChangesAsync();
        }

        public async Task<int> CountLikesByPostIdAsync(long postId)
        {
            return await this.context.PostLikes.CountAsync(l => l.PostId == postId);
        }

        public async Task<bool> IsLikedAsync(long postId, long bloggerId)
        {
            return await this.context.PostLikes.AnyAsync(l => l.PostId == postId && l.BloggerId == bloggerId);
        }

        public async Task RemoveLikeAsync(PostLike postLike)
        {
            this.context.PostLikes.Remove(postLike);
            await this.context.SaveChangesAsync();
        }

        public async Task RemoveLikeAsync(long postId, long bloggerId)
        {
            var like = await context.PostLikes
                .FirstOrDefaultAsync(l => l.PostId == postId && l.BloggerId == bloggerId);

            if (like != null)
            {
                var notifications = this.context.Notifications
                    .Where(n => n.LikeId == like.Id)
                    .ToList();

                this.context.Notifications.RemoveRange(notifications);

                context.PostLikes.Remove(like);
                await context.SaveChangesAsync();
            }
        }

        public async Task<List<PostLike>> GetAllAsync(Expression<Func<PostLike, bool>> predicate, CancellationToken cancellationToken = default)
        {
            if (predicate != null)
            {
                return await context.PostLikes.Where(predicate).ToListAsync(cancellationToken);
            }
            return await this.context.PostLikes.ToListAsync(cancellationToken);
        }

        public async Task<List<PostLike>> GetLikesByPostIdAsync(long postId, CancellationToken cancellationToken = default)
        {
            return await this.context.PostLikes
                .Where(like => like.PostId == postId)
                .ToListAsync(cancellationToken);
        }
    }
}
