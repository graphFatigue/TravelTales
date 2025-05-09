using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TravelTales.Application.DTOs.BloggerFollow;
using TravelTales.Application.Interfaces;
using TravelTales.Application.Services;

namespace TravelTales.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class BloggerFollowController : ControllerBase
    {
        private readonly IBloggerService bloggerService;
        private readonly ILogger<BloggerBlockController> logger;

        public BloggerFollowController(
            IBloggerService bloggerService,
            ILogger<BloggerBlockController> logger)
        {
            this.bloggerService = bloggerService;
            this.logger = logger;
        }

        [HttpPost("{id}/follow")]
        public async Task<IActionResult> FollowBlogger(long id, CancellationToken cancellationToken)
        {
            await bloggerService.FollowBloggerAsync(id, cancellationToken);
            return NoContent();
        }

        [HttpDelete("{id}/follow")]
        public async Task<IActionResult> UnfollowBlogger(long id, CancellationToken cancellationToken)
        {
            await bloggerService.UnfollowBloggerAsync(id, cancellationToken);
            return NoContent();
        }

        [HttpGet("{id}/followers")]
        public async Task<ActionResult<IEnumerable<BloggerFollowDto>>> GetFollowers(long id, CancellationToken cancellationToken)
        {
            var followers = await bloggerService.GetFollowersAsync(id, cancellationToken);
            return Ok(followers);
        }

        [HttpGet("{id}/following")]
        public async Task<ActionResult<IEnumerable<BloggerFollowDto>>> GetFollowing(long id, CancellationToken cancellationToken)
        {
            var following = await bloggerService.GetFollowingAsync(id, cancellationToken);
            return Ok(following);
        }
    }
}
