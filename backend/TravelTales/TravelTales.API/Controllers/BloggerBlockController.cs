//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Mvc;
//using TravelTales.Application.DTOs.BloggerBlock;
//using TravelTales.Application.Interfaces;

//namespace TravelTales.API.Controllers
//{
//    [Authorize]
//    [ApiController]
//    [Route("api/[controller]")]
//    public class BloggerBlockController : ControllerBase
//    {
//        private readonly IBloggerBlockService bloggerBlockService;
//        private readonly IBloggerService bloggerService;
//        private readonly ILogger<BloggerBlockController> logger;

//        public BloggerBlockController(
//            IBloggerBlockService bloggerBlockService,
//            IBloggerService bloggerService,
//            ILogger<BloggerBlockController> logger)
//        {
//            this.bloggerBlockService = bloggerBlockService;
//            this.bloggerService = bloggerService;
//            this.logger = logger;
//        }

//        [HttpPost("block/{blockedId}")]
//        public async Task<IActionResult> BlockBlogger(long blockedId, CancellationToken cancellationToken)
//        {
//            this.logger.LogTrace("Starting BlockBlogger action for blocked ID {BlockedId}", blockedId);

//            var currentBloggerId = await this.bloggerService.GetCurrentBloggerId(cancellationToken);
//            var dto = new BlockBloggerDto { BlockerId = currentBloggerId, BlockedId = blockedId };

//            await this.bloggerBlockService.BlockBloggerAsync(dto);
//            this.logger.LogInformation("Successfully blocked blogger ID {BlockedId}", blockedId);

//            return this.NoContent();
//        }

//        [HttpDelete("unblock/{blockedId}")]
//        public async Task<IActionResult> UnblockBlogger(long blockedId, CancellationToken cancellationToken)
//        {
//            this.logger.LogTrace("Starting UnblockBlogger action for blocked ID {BlockedId}", blockedId);

//            var currentBloggerId = await this.bloggerService.GetCurrentBloggerId(cancellationToken);
//            var dto = new UnblockBloggerDto { BlockerId = currentBloggerId, UnblockedId = blockedId };

//            await this.bloggerBlockService.UnblockBloggerAsync(dto);
//            this.logger.LogInformation("Successfully unblocked blogger ID {BlockedId}", blockedId);

//            return this.NoContent();
//        }

//        [HttpGet("blocked")]
//        public async Task<IActionResult> GetBlockedBloggers(CancellationToken cancellationToken)
//        {
//            this.logger.LogTrace("Starting GetBlockedBloggers action");

//            var currentBloggerId = await this.bloggerService.GetCurrentBloggerId(cancellationToken);
//            var blockedIds = await this.bloggerBlockService.GetBlockedBloggerIdsAsync(currentBloggerId);

//            this.logger.LogInformation("Retrieved {Count} blocked bloggers", blockedIds.Count());
//            return this.Ok(blockedIds);
//        }

//        [HttpGet("is-blocked/{bloggerId}")]
//        public async Task<IActionResult> IsBloggerBlocked(long bloggerId, CancellationToken cancellationToken)
//        {
//            this.logger.LogTrace("Checking if blogger ID {BloggerId} is blocked", bloggerId);

//            var currentBloggerId = await this.bloggerService.GetCurrentBloggerId(cancellationToken);
//            var isBlocked = await this.bloggerBlockService.IsBlockedAsync(currentBloggerId, bloggerId);

//            this.logger.LogDebug("Block check result for blogger ID {BloggerId}: {IsBlocked}", bloggerId, isBlocked);
//            return this.Ok(isBlocked);
//        }
//    }
//}