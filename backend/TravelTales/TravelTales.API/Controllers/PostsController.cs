using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sieve.Models;
using TravelTales.Application.DTOs.Post;
using TravelTales.Application.Interfaces;

namespace TravelTales.API.Controllers
{
    [AllowAnonymous]
    [ApiController, Route("api/[controller]")]
    public class PostsController : ControllerBase
    {
        private readonly IPostService postService;
        private readonly ILogger<PostsController> logger;

        public PostsController(IPostService postService, ILogger<PostsController> logger)
        {
            this.postService = postService;
            this.logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(CancellationToken cancellationToken = default)
        {
            this.logger.LogTrace("Starting GetAll action in PostsController");

            var posts = await this.postService.GetPostsAsync(cancellationToken);
            this.logger.LogInformation("Successfully retrieved posts");
            return this.Ok(posts);
        }

        [HttpGet("filter")]
        public async Task<IActionResult> GetAllWithFilter([FromQuery] SieveModel sieveModel, CancellationToken cancellationToken = default)
        {
            this.logger.LogTrace("Starting GetAllWithFilter action in PostsController with filter parameters: {SieveModel}", sieveModel);

            var posts = await this.postService.GetPostsWithFilterAsync(sieveModel, cancellationToken);
            this.logger.LogInformation("Successfully retrieved filtered posts");
            return this.Ok(posts);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(long id, CancellationToken cancellationToken)
        {
            this.logger.LogTrace("Starting GetById action in PostsController for ID {Id}", id);

            var post = await this.postService.GetPostByIdAsync(id, cancellationToken);
            if (post == null)
            {
                this.logger.LogWarning("Post with ID {Id} was not found", id);
            }
            else
            {
                this.logger.LogInformation("Post with ID {Id} retrieved successfully", id);
            }

            return this.Ok(post);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreatePostDto createPostDto, CancellationToken cancellationToken)
        {
            this.logger.LogTrace("Starting Create action in PostsController with post title: {Title}", createPostDto.Title);

            var post = await this.postService.CreatePostAsync(createPostDto, cancellationToken);
            this.logger.LogInformation("Post created successfully with ID {Id}", post.Id);
            return this.Ok(post);
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(long id, [FromBody] UpdatePostDto updatePostDto, CancellationToken cancellationToken)
        {
            this.logger.LogTrace("Starting Update action in PostsController for post ID {Id}", id);

            await this.postService.UpdatePostAsync(id, updatePostDto, cancellationToken);
            this.logger.LogInformation("Post with ID {Id} updated successfully", id);
            return this.NoContent();
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(long id, CancellationToken cancellationToken)
        {
            this.logger.LogTrace("Starting Delete action in PostsController for post ID {Id}", id);

            await this.postService.DeletePostAsync(id, cancellationToken);
            this.logger.LogInformation("Post with ID {Id} deleted successfully", id);
            return this.NoContent();

        }
    }
}
