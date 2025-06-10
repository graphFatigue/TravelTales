using TravelTales.Domain.Entities;

namespace TravelTales.Application.Interfaces
{
    public interface IJwtService
    {
        Task<string> GenerateTokenAsync(User userEntity);
    }
}
