using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TravelTales.Application.Exceptions;
using TravelTales.Application.Interfaces;

namespace TravelTales.Application.Utility
{
    public class ContextAccessor : IContextAccessor
    {
        private readonly IHttpContextAccessor httpContextAccessor;

        public ContextAccessor(IHttpContextAccessor httpContextAccessor)
        {
            this.httpContextAccessor = httpContextAccessor;
        }

        public Guid GetCurrentUserId()
        {
            var idClaim = this.httpContextAccessor.HttpContext?.User.Claims.FirstOrDefault(x =>
                x.Type == ClaimTypes.NameIdentifier);
            if (idClaim is null)
            {
                throw new NotAuthorizedException();
            }

            return Guid.Parse(idClaim.Value);
        }

        public ICollection<string> GetCurrentUserRoles()
        {
            var roleClaims = this.httpContextAccessor.HttpContext?.User.Claims
                .Where(x => x.Type == ClaimTypes.Role)
                .Select(x => x.Value)
                .ToList();

            if (roleClaims is null || roleClaims.Count == 0)
            {
                throw new NotAuthorizedException("User has no roles.");
            }

            return roleClaims;
        }
    }

}
