using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sieve.Models;
using TravelTales.Application.DTOs.User;
using TravelTales.Application.Interfaces;

namespace TravelTales.API.Controllers
{
    [Authorize]
    [ApiController, Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService userService;
        private readonly IContextAccessor contextAccessor;
        private readonly ILogger<UsersController> logger;

        public UsersController(IUserService userService, IContextAccessor contextAccessor, ILogger<UsersController> logger)
        {
            this.userService = userService;
            this.contextAccessor = contextAccessor;
            this.logger = logger;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
        {
            this.logger.LogTrace("Starting GetAll action for users");
            var users = await this.userService.GetAllUsersAsync(cancellationToken);
            this.logger.LogInformation("Successfully retrieved {Count} users", users?.Count() ?? 0);
            return this.Ok(users);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
        {
            this.logger.LogTrace("Starting GetById action for user ID {Id}", id);
            var user = await this.userService.GetUserByIdAsync(id, cancellationToken);
            if (user == null)
            {
                this.logger.LogWarning("User with ID {Id} was not found", id);
                return this.NotFound();
            }

            this.logger.LogInformation("User with ID {Id} retrieved successfully", id);
            return this.Ok(user);
        }

        [HttpGet("current")]
        public async Task<IActionResult> GetCurrentUser(CancellationToken cancellationToken)
        {
            var userId = this.contextAccessor.GetCurrentUserId();
            this.logger.LogTrace("Starting GetCurrentUser action for user ID {UserId}", userId);
            var user = await this.userService.GetUserByIdAsync(userId, cancellationToken);
            if (user == null)
            {
                this.logger.LogWarning("Current user with ID {UserId} was not found", userId);
                return this.NotFound();
            }

            this.logger.LogInformation("Current user with ID {UserId} retrieved successfully", userId);
            return this.Ok(user);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("assign-role")]
        public async Task<IActionResult> AssignRole([FromBody] AssignRoleDto assignRoleDto, CancellationToken cancellationToken)
        {
            this.logger.LogTrace("Starting AssignRole action for user ID {UserId}", assignRoleDto.UserId);
            await this.userService.AssignRoleToUserAsync(assignRoleDto, cancellationToken);
            this.logger.LogInformation("Role assigned to user ID {UserId} successfully", assignRoleDto.UserId);
            return this.NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("filter")]
        public async Task<IActionResult> GetFilteredUsers(
            [FromQuery] SieveModel sieveModel,
            CancellationToken cancellationToken)
        {
            this.logger.LogTrace("Starting GetFilteredUsers action");

            var result = await this.userService.GetUsersWithFilterAsync(sieveModel, cancellationToken);
            this.logger.LogInformation($"Retrieved filtered users");
            return this.Ok(result);
        }
    }
}
