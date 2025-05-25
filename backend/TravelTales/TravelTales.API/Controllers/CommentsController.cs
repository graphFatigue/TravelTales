using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sieve.Models;
using TravelTales.Application.Interfaces;

namespace TravelTales.API.Controllers
{
    [Authorize]
    [ApiController, Route("api/[controller]")]
    public class CommentsController : ControllerBase
    {
        private readonly ICommentService commentService;
        private readonly ILogger<CommentsController> logger;

        public CommentsController(ICommentService commentService, ILogger<CommentsController> logger)
        {
            this.commentService = commentService;
            this.logger = logger;
        }

        [HttpGet("filter")]
        public async Task<IActionResult> GetAllWithFilter([FromQuery] SieveModel sieveModel, CancellationToken cancellationToken = default)
        {
            this.logger.LogTrace("Starting GetAllWithFilter action in CommentsController with filter parameters: {SieveModel}", sieveModel);

            var comments = await this.commentService.GetCommentsWithFilterAsync(sieveModel, cancellationToken);
            this.logger.LogInformation("Successfully retrieved filtered comments");

            return this.Ok(comments);
        }
    }
}
