using Microsoft.AspNetCore.Authorization;

namespace TravelTales.Application.Authorization.Attributes
{
    public class HasPermissionAttribute : AuthorizeAttribute
    {
        public HasPermissionAttribute(string permission)
            : base(permission)
        {
        }
    }
}
