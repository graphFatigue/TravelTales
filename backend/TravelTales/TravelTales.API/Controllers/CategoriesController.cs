using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sieve.Models;
using TravelTales.Application.DTOs.Category;
using TravelTales.Application.Interfaces;

namespace TravelTales.API.Controllers
{
    [Authorize]
    [ApiController, Route("api/[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryService categoryService;
        private readonly ILogger<CategoriesController> logger;

        public CategoriesController(ICategoryService categoryService, ILogger<CategoriesController> logger)
        {
            this.categoryService = categoryService;
            this.logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(CancellationToken cancellationToken = default)
        {
            this.logger.LogTrace("Starting GetAll action in CategoriesController");

            var categories = await this.categoryService.GetCategoriesAsync(cancellationToken);
            this.logger.LogInformation("Successfully retrieved categories");
            return this.Ok(categories);
        }

        [HttpGet("filter")]
        public async Task<IActionResult> GetAllWithFilter([FromQuery] SieveModel sieveModel, CancellationToken cancellationToken = default)
        {
            this.logger.LogTrace("Starting GetAllWithFilter action in CategoriesController with filter parameters: {SieveModel}", sieveModel);

            var categories = await this.categoryService.GetCategoriesWithFilterAsync(sieveModel, cancellationToken);
            this.logger.LogInformation("Successfully retrieved filtered categories");
            return this.Ok(categories);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(long id, CancellationToken cancellationToken)
        {
            this.logger.LogTrace("Starting GetById action in CategoriesController for ID {Id}", id);

            var category = await this.categoryService.GetCategoryByIdAsync(id, cancellationToken);
            if (category == null)
            {
                this.logger.LogWarning("Category with ID {Id} was not found", id);
            }
            else
            {
                this.logger.LogInformation("Category with ID {Id} retrieved successfully", id);
            }

            return this.Ok(category);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateCategoryDto createCategoryDto, CancellationToken cancellationToken)
        {
            this.logger.LogTrace("Starting Create action in CategoriesController with category title: {Name}", createCategoryDto.Name);

            var category = await this.categoryService.CreateCategoryAsync(createCategoryDto, cancellationToken);
            this.logger.LogInformation("Category created successfully with ID {Id}", category.Id);
            return this.Ok(category);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(long id, [FromBody] UpdateCategoryDto updateCategoryDto, CancellationToken cancellationToken)
        {
            this.logger.LogTrace("Starting Update action in CategoriesController for category ID {Id}", id);

            await this.categoryService.UpdateCategoryAsync(id, updateCategoryDto, cancellationToken);
            this.logger.LogInformation("Category with ID {Id} updated successfully", id);
            return this.NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(long id, CancellationToken cancellationToken)
        {
            this.logger.LogTrace("Starting Delete action in CategoriesController for category ID {Id}", id);

            await this.categoryService.DeleteCategoryAsync(id, cancellationToken);
            this.logger.LogInformation("Category with ID {Id} deleted successfully", id);
            return this.NoContent();
        }
    }
}
