using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
            try
            {
                var users = await this.userService.GetAllUsersAsync(cancellationToken);
                this.logger.LogInformation("Successfully retrieved {Count} users", users?.Count() ?? 0);
                return this.Ok(users);
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, "An error occurred while retrieving all users");
                throw;
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
        {
            this.logger.LogTrace("Starting GetById action for user ID {Id}", id);
            try
            {
                var user = await this.userService.GetUserByIdAsync(id, cancellationToken);
                if (user == null)
                {
                    this.logger.LogWarning("User with ID {Id} was not found", id);
                    return this.NotFound();
                }

                this.logger.LogInformation("User with ID {Id} retrieved successfully", id);
                return this.Ok(user);
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, "An error occurred while retrieving the user with ID {Id}", id);
                throw;
            }
        }

        [HttpGet("current")]
        public async Task<IActionResult> GetCurrentUser(CancellationToken cancellationToken)
        {
            var userId = this.contextAccessor.GetCurrentUserId();
            this.logger.LogTrace("Starting GetCurrentUser action for user ID {UserId}", userId);
            try
            {
                var user = await this.userService.GetUserByIdAsync(userId, cancellationToken);
                if (user == null)
                {
                    this.logger.LogWarning("Current user with ID {UserId} was not found", userId);
                    return this.NotFound();
                }

                this.logger.LogInformation("Current user with ID {UserId} retrieved successfully", userId);
                return this.Ok(user);
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, "An error occurred while retrieving the current user with ID {UserId}", userId);
                throw;
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("assign-role")]
        public async Task<IActionResult> AssignRole([FromBody] AssignRoleDto assignRoleDto, CancellationToken cancellationToken)
        {
            this.logger.LogTrace("Starting AssignRole action for user ID {UserId}", assignRoleDto.UserId);
            try
            {
                await this.userService.AssignRoleToUserAsync(assignRoleDto, cancellationToken);
                this.logger.LogInformation("Role assigned to user ID {UserId} successfully", assignRoleDto.UserId);
                return this.NoContent();
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, "An error occurred while assigning role to user ID {UserId}", assignRoleDto.UserId);
                throw;
            }
        }
    }
}
