using TravelTales.Application.DTOs.User;

namespace TravelTales.Application.Interfaces
{
    public interface IJwtService
    {
        Task<string> GenerateTokenAsync(UserDto userEntity);
    }
}
