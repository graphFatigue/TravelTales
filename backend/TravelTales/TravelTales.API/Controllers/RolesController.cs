using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TravelTales.Application.DTOs.Role;
using TravelTales.Application.Interfaces;

namespace TravelTales.API.Controllers
{
    [ApiController, Route("api/[controller]")]
    public class RolesController : ControllerBase
    {
        private readonly IRoleService roleService;
        private readonly ILogger<RolesController> logger;

        public RolesController(IRoleService roleService, ILogger<RolesController> logger)
        {
            this.roleService = roleService;
            this.logger = logger;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
        {
            this.logger.LogTrace("Starting GetAll action");
            try
            {
                var roles = await this.roleService.GetAllRolesAsync(cancellationToken);
                this.logger.LogInformation("Successfully retrieved {Count} roles", roles.Count());
                return this.Ok(roles);
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, "An error occurred while retrieving all roles");
                throw;
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
        {
            this.logger.LogTrace("Starting GetById action for ID {Id}", id);
            try
            {
                var role = await this.roleService.GetRoleByIdAsync(id, cancellationToken);
                if (role == null)
                {
                    this.logger.LogWarning("Role with ID {Id} was not found", id);
                }
                else
                {
                    this.logger.LogInformation("Role with ID {Id} retrieved successfully", id);
                }

                return this.Ok(role);
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, "An error occurred while retrieving the role with ID {Id}", id);
                throw;
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateRoleDto createRoleDto, CancellationToken cancellationToken)
        {
            this.logger.LogTrace("Starting Create action with role name: {Name}", createRoleDto.Name);
            try
            {
                var role = await this.roleService.CreateRoleAsync(createRoleDto, cancellationToken);
                this.logger.LogInformation("Role created successfully with ID {Id}", role.Id);
                return this.Ok(role);
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, "An error occurred while creating a new role");
                throw;
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateRoleDto updateRoleDto, CancellationToken cancellationToken)
        {
            this.logger.LogTrace("Starting Update action for role ID {Id}", id);
            try
            {
                await this.roleService.UpdateRoleAsync(id, updateRoleDto, cancellationToken);
                this.logger.LogInformation("Role with ID {Id} updated successfully", id);
                return this.NoContent();
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, "An error occurred while updating the role with ID {Id}", id);
                throw;
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
        {
            this.logger.LogTrace("Starting Delete action for role ID {Id}", id);
            try
            {
                await this.roleService.DeleteRoleAsync(id, cancellationToken);
                this.logger.LogInformation("Role with ID {Id} deleted successfully", id);
                return this.NoContent();
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, "An error occurred while deleting the role with ID {Id}", id);
                throw;
            }
        }
    }
}
