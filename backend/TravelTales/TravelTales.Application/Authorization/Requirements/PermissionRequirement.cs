using Microsoft.AspNetCore.Authorization;

namespace TravelTales.Application.Authorization.Requirements
{
    public class PermissionRequirement : IAuthorizationRequirement
    {
        public PermissionRequirement(string permission)
        {
            this.Permission = permission;
        }

        public string Permission { get; }
    }
}
