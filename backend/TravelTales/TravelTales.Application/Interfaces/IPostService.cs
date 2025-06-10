using Sieve.Models;
using TravelTales.Application.DTOs.Post;
using TravelTales.Persistence.SharedFiles;

namespace TravelTales.Application.Interfaces
{
    public interface IPostService
    {
        Task<IEnumerable<PostDto>> GetPostsAsync(CancellationToken cancellationToken = default);

        Task<PostDto?> GetPostByIdAsync(long id, CancellationToken cancellationToken = default);

        Task<PostDto> CreatePostAsync(CreatePostDto createPostDto, CancellationToken cancellationToken = default);

        Task UpdatePostAsync(long id, UpdatePostDto updatePostDto, CancellationToken cancellationToken = default);

        Task DeletePostAsync(long id, CancellationToken cancellationToken = default);

        Task<PagedList<PostDto>> GetPostsWithFilterAsync(SieveModel sieveModel, CancellationToken cancellationToken = default);
    }
}
