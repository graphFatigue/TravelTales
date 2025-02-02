using TravelTales.Application.DTOs.User;

namespace TravelTales.Application.Interfaces
{
    public interface IUserService
    {
        Task<IEnumerable<UserDto>> GetAllUsersAsync(CancellationToken cancellationToken = default);

        Task<UserDto> GetUserByIdAsync(Guid id, CancellationToken cancellationToken = default);

        Task UpdateAsync(Guid id, UpdateUserDto updateUserDto, CancellationToken cancellationToken = default);

        Task AssignRoleToUserAsync(AssignRoleDto assignRoleDto, CancellationToken cancellationToken = default);
    }
}
