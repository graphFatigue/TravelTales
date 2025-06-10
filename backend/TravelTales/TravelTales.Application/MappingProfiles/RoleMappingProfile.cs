using AutoMapper;
using TravelTales.Application.DTOs.Role;
using TravelTales.Domain.Entities;

namespace TravelTales.Application.MappingProfiles
{
    public class RoleMappingProfile : Profile
    {
        public RoleMappingProfile()
        {
            this.CreateMap<Role, RoleDto>();
            this.CreateMap<CreateRoleDto, Role>();
        }
    }
}
