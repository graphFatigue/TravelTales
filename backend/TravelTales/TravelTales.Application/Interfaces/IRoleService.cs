using TravelTales.Application.DTOs.Role;

namespace TravelTales.Application.Interfaces
{
    public interface IRoleService
    {
        Task<IEnumerable<RoleDto>> GetAllRolesAsync(CancellationToken cancellationToken = default);

        Task<RoleDto?> GetRoleByIdAsync(Guid id, CancellationToken cancellationToken = default);

        Task<RoleDto> CreateRoleAsync(CreateRoleDto createRoleDto, CancellationToken cancellationToken = default);

        Task UpdateRoleAsync(Guid id, UpdateRoleDto updateRoleDto, CancellationToken cancellationToken = default);

        Task DeleteRoleAsync(Guid id, CancellationToken cancellationToken = default);
    }
}
