using AutoMapper;
using Microsoft.AspNetCore.Identity;
using TravelTales.Application.DTOs.User;
using TravelTales.Application.Exceptions;
using TravelTales.Application.Interfaces;
using TravelTales.Domain.Entities;
using TravelTales.Persistence.Interfaces;

namespace TravelTales.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly IMapper mapper;
        private readonly UserManager<User> userManager;

        public UserService(
            IUnitOfWork unitOfWork,
            IMapper mapper,
            UserManager<User> userManager)
        {
            this.unitOfWork = unitOfWork;
            this.mapper = mapper;
            this.userManager = userManager;
        }

        public async Task<IEnumerable<UserDto>> GetAllUsersAsync(CancellationToken cancellationToken = default)
        {
            var users = await this.unitOfWork.GetRepository<IUserRepository>().GetAllAsync(cancellationToken);
            return this.mapper.Map<IEnumerable<UserDto>>(users);
        }

        public async Task<UserDto> GetUserByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            var user = await this.unitOfWork.GetRepository<IUserRepository>().GetByIdFullAsync(id, cancellationToken);
            if (user is null)
            {
                throw new NotFoundException($"User with ID {id} was not found.");
            }

            return this.mapper.Map<UserDto>(user);
        }

        public async Task UpdateAsync(
           Guid id,
           UpdateUserDto updateUserDto,
           CancellationToken cancellationToken = default)
        {
            var user = await this.unitOfWork
                           .GetRepository<IUserRepository>()
                           .GetByIdAsync(id, cancellationToken)
                       ?? throw new NotFoundException($"User with ID {id} was not found.");

            ArgumentNullException.ThrowIfNull(updateUserDto);

            this.unitOfWork
                .GetRepository<IUserRepository>()
                .Update(user);

            await this.unitOfWork.SaveChangesAsync(cancellationToken);
        }

        public async Task AssignRoleToUserAsync(AssignRoleDto assignRoleDto, CancellationToken cancellationToken = default)
        {
            ValidateAssignRoleDto(assignRoleDto);
            await this.PerformRoleAssignmentAsync(assignRoleDto, cancellationToken);
        }

        private static void ValidateAssignRoleDto(AssignRoleDto assignRoleDto)
        {
            ArgumentNullException.ThrowIfNull(assignRoleDto);
        }

        private async Task PerformRoleAssignmentAsync(AssignRoleDto assignRoleDto, CancellationToken cancellationToken)
        {
            var user = await this.unitOfWork
                .GetRepository<IUserRepository>()
                .GetByIdAsync(assignRoleDto.UserId, cancellationToken)
                ?? throw new NotFoundException($"User with ID {assignRoleDto.UserId} was not found.");

            var role = await this.unitOfWork.GetRepository<IRoleRepository>().GetByIdAsync(assignRoleDto.RoleId, cancellationToken)
                ?? throw new NotFoundException($"Role with ID {assignRoleDto.RoleId} was not found.");

            var roles = await this.userManager.GetRolesAsync(user);
            if (roles.Contains(role.Name!))
            {
                throw new BusinessException($"User already has the role '{role.Name}'.");
            }

            var result = await this.userManager.AddToRoleAsync(user, role.Name!);
            if (!result.Succeeded)
            {
                throw new BusinessException($"Failed to assign role '{role.Name}' to the user.");
            }
        }
    }
}
