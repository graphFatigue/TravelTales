using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sieve.Models;
using TravelTales.Application.DTOs.Blogger;
using TravelTales.Application.Interfaces;

namespace TravelTales.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BloggerController : ControllerBase
    {
        private readonly IBloggerService bloggerService;
        private readonly ILogger<BloggerController> logger;

        public BloggerController(IBloggerService bloggerService, ILogger<BloggerController> logger)
        {
            this.bloggerService = bloggerService;
            this.logger = logger;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetAll(CancellationToken cancellationToken = default)
        {
            this.logger.LogTrace("Starting GetAll action in BloggerController");

            var bloggers = await this.bloggerService.GetBloggersAsync(cancellationToken);
            this.logger.LogInformation("Successfully retrieved bloggers");
            return this.Ok(bloggers);
        }

        [AllowAnonymous]
        [HttpGet("filter")]
        public async Task<IActionResult> GetAllWithFilter([FromQuery] SieveModel sieveModel, CancellationToken cancellationToken = default)
        {
            this.logger.LogTrace("Starting GetAllWithFilter action in BloggerController with filter parameters: {SieveModel}", sieveModel);

            var bloggers = await this.bloggerService.GetBloggersWithFilterAsync(sieveModel, cancellationToken);
            this.logger.LogInformation("Successfully retrieved filtered bloggers");
            return this.Ok(bloggers);
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(long id, CancellationToken cancellationToken)
        {
            this.logger.LogTrace("Starting GetById action in BloggerController for ID {Id}", id);

            var blogger = await this.bloggerService.GetBloggerByIdAsync(id, cancellationToken);
            if (blogger == null)
            {
                this.logger.LogWarning("Blogger with ID {Id} was not found", id);
                return this.NotFound();
            }

            this.logger.LogInformation("Blogger with ID {Id} retrieved successfully", id);
            return this.Ok(blogger);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateBloggerDto createBloggerDto, CancellationToken cancellationToken)
        {
            this.logger.LogTrace("Starting Create action in BloggerController for user ID: {UserId}", createBloggerDto.UserId);

            var blogger = await this.bloggerService.CreateBloggerAsync(createBloggerDto, cancellationToken);
            this.logger.LogInformation("Blogger created successfully with ID {Id}", blogger.Id);
            return this.Ok(blogger);
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(long id, [FromBody] UpdateBloggerDto updateBloggerDto, CancellationToken cancellationToken)
        {
            this.logger.LogTrace("Starting Update action in BloggerController for blogger ID {Id}", id);

            await this.bloggerService.UpdateBloggerAsync(id, updateBloggerDto, cancellationToken);
            this.logger.LogInformation("Blogger with ID {Id} updated successfully", id);
            return this.NoContent();
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(long id, CancellationToken cancellationToken)
        {
            this.logger.LogTrace("Starting Delete action in BloggerController for blogger ID {Id}", id);

            await this.bloggerService.DeleteBloggerAsync(id, cancellationToken);
            this.logger.LogInformation("Blogger with ID {Id} deleted successfully", id);
            return this.NoContent();
        }

        [Authorize]
        [HttpPut("{id}/image")]
        public async Task<IActionResult> UpdateImage(long id, [FromBody] UpdateBloggerImageDto imageDto, CancellationToken cancellationToken)
        {
            this.logger.LogTrace("Starting UpdateImage action in BloggerController for blogger ID {Id}", id);

            await this.bloggerService.UpdateBloggerImageAsync(id, imageDto, cancellationToken);
            this.logger.LogInformation("Blogger image updated successfully for ID {Id}", id);
            return this.NoContent();
        }

        [HttpGet("{id}/stats")]
        public async Task<IActionResult> GetBloggerStats(
        long id,
        CancellationToken cancellationToken)
        {
                var stats = await bloggerService.GetBloggerStatsAsync(id, cancellationToken);
                return Ok(stats);
        }
    }
}
