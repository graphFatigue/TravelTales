using AutoMapper;
using TravelTales.Application.DTOs.Role;
using TravelTales.Application.Exceptions;
using TravelTales.Application.Interfaces;
using TravelTales.Domain.Entities;
using TravelTales.Persistence.Interfaces;

namespace TravelTales.Application.Services
{
    public class RoleService : IRoleService
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly IMapper mapper;

        public RoleService(
            IUnitOfWork unitOfWork,
            IMapper mapper)
        {
            this.unitOfWork = unitOfWork;
            this.mapper = mapper;
        }

        public async Task<IEnumerable<RoleDto>> GetAllRolesAsync(CancellationToken cancellationToken = default)
        {
            var roles = await this.unitOfWork.GetRepository<IRoleRepository>().GetAllAsync(cancellationToken);
            return this.mapper.Map<IEnumerable<RoleDto>>(roles);
        }

        public async Task<RoleDto?> GetRoleByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            var role = await this.GetRoleInternalAsync(id, cancellationToken);
            return this.mapper.Map<RoleDto>(role);
        }

        public async Task<RoleDto> CreateRoleAsync(CreateRoleDto createRoleDto, CancellationToken cancellationToken = default)
        {
            var role = this.mapper.Map<Role>(createRoleDto);

            await this.unitOfWork.GetRepository<IRoleRepository>().AddAsync(role, cancellationToken);
            await this.unitOfWork.SaveChangesAsync(cancellationToken);

            return this.mapper.Map<RoleDto>(role);
        }

        public async Task UpdateRoleAsync(Guid id, UpdateRoleDto updateRoleDto, CancellationToken cancellationToken = default)
        {
            var role = await this.GetRoleInternalAsync(id, cancellationToken);

            ArgumentNullException.ThrowIfNull(updateRoleDto);

            role.Name = updateRoleDto.Name;

            this.unitOfWork.GetRepository<IRoleRepository>().Update(role);
            await this.unitOfWork.SaveChangesAsync(cancellationToken);
        }

        public async Task DeleteRoleAsync(Guid id, CancellationToken cancellationToken = default)
        {
            var role = await this.GetRoleInternalAsync(id, cancellationToken);

            this.unitOfWork.GetRepository<IRoleRepository>().Delete(role);
            await this.unitOfWork.SaveChangesAsync(cancellationToken);
        }

        private async Task<Role> GetRoleInternalAsync(Guid id, CancellationToken cancellationToken)
        {
            var role = await this.unitOfWork.GetRepository<IRoleRepository>().GetByIdAsync(id, cancellationToken);
            if (role is null)
            {
                throw new NotFoundException();
            }

            return role;
        }
    }
}
