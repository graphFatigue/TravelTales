using Sieve.Models;
using TravelTales.Application.DTOs.Category;
using TravelTales.Persistence.SharedFiles;

namespace TravelTales.Application.Interfaces
{
    public interface ICategoryService
    {
        Task<IEnumerable<CategoryDto>> GetCategoriesAsync(CancellationToken cancellationToken = default);

        Task<CategoryDto?> GetCategoryByIdAsync(long id, CancellationToken cancellationToken = default);

        Task<CategoryDto> CreateCategoryAsync(CreateCategoryDto createCategoryDto, CancellationToken cancellationToken = default);

        Task UpdateCategoryAsync(long id, UpdateCategoryDto updateCategoryDto, CancellationToken cancellationToken = default);

        Task DeleteCategoryAsync(long id, CancellationToken cancellationToken = default);

        Task<PagedList<CategoryDto>> GetCategoriesWithFilterAsync(SieveModel sieveModel, CancellationToken cancellationToken = default);
    }
}
