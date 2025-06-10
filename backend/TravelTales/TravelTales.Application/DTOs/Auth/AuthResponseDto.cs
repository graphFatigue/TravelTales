using TravelTales.Application.DTOs.User;

namespace TravelTales.Application.DTOs.Auth
{
    public class AuthResponseDto
    {
        public string AccessToken { get; set; }
        public UserDto? User { get; set; }
    }
}
