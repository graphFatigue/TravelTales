using Sieve.Models;
using TravelTales.Application.DTOs.User;
using TravelTales.Persistence.SharedFiles;

namespace TravelTales.Application.Interfaces
{
    public interface IUserService
    {
        Task<IEnumerable<UserDto>> GetAllUsersAsync(CancellationToken cancellationToken = default);

        Task<UserDto> GetUserByIdAsync(Guid id, CancellationToken cancellationToken = default);

        Task UpdateAsync(Guid id, UpdateUserDto updateUserDto, CancellationToken cancellationToken = default);

        Task AssignRoleToUserAsync(AssignRoleDto assignRoleDto, CancellationToken cancellationToken = default);

        Task<PagedList<UserDto>> GetUsersWithFilterAsync(SieveModel sieveModel, CancellationToken cancellationToken = default);

        Task DeleteUserAsync(Guid id, CancellationToken cancellationToken = default);
    }
}
