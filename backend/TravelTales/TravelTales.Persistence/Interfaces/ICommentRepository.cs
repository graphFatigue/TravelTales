using TravelTales.Domain.Entities;

namespace TravelTales.Persistence.Interfaces
{
    public interface ICommentRepository : IGenericRepository<Comment, long>
    {
        //Task AddCommentAsync(Comment comment);
        Task<List<Comment>> GetCommentsByPostIdAsync(long postId);
    }
}
