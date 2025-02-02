namespace TravelTales.Application.Interfaces
{
    public interface IContextAccessor
    {
        Guid GetCurrentUserId();

        ICollection<string> GetCurrentUserRoles();
    }
}
