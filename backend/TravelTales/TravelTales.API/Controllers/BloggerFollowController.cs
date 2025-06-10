using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sieve.Models;
using TravelTales.Application.DTOs.BloggerFollow;
using TravelTales.Application.Interfaces;
using TravelTales.Application.Services;
using TravelTales.Persistence.SharedFiles;

namespace TravelTales.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BloggerFollowController : ControllerBase
    {
        private readonly IBloggerService bloggerService;
        private readonly ILogger<BloggerFollowController> logger;

        public BloggerFollowController(
            IBloggerService bloggerService,
            ILogger<BloggerFollowController> logger)
        {
            this.bloggerService = bloggerService;
            this.logger = logger;
        }

        [Authorize]
        [HttpPost("{id}/follow")]
        public async Task<IActionResult> FollowBlogger(long id, CancellationToken cancellationToken)
        {
            await bloggerService.FollowBloggerAsync(id, cancellationToken);
            return NoContent();
        }

        [Authorize]
        [HttpDelete("{id}/follow")]
        public async Task<IActionResult> UnfollowBlogger(long id, CancellationToken cancellationToken)
        {
            await bloggerService.UnfollowBloggerAsync(id, cancellationToken);
            return NoContent();
        }

        [HttpGet("{id}/followers")]
        public async Task<ActionResult<PagedList<BloggerFollowDto>>> GetFollowers(
            long id,
            [FromQuery] SieveModel sieveModel,
            CancellationToken cancellationToken)
        {
            var followers = await bloggerService.GetFollowersWithFilterAsync(id, sieveModel, cancellationToken);
            return Ok(followers);
        }

        [HttpGet("{id}/following")]
        public async Task<ActionResult<PagedList<BloggerFollowDto>>> GetFollowing(
            long id,
            [FromQuery] SieveModel sieveModel,
            CancellationToken cancellationToken)
        {
            var following = await bloggerService.GetFollowingWithFilterAsync(id, sieveModel, cancellationToken);
            return Ok(following);
        }
    }
}
