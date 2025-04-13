using TravelTales.Application.DTOs.User;

namespace TravelTales.Application.DTOs.Auth
{
    public class ExternalAuthResponseDto
    {
        public string AccessToken { get; set; }
        public bool IsNewUser { get; set; }
        public UserDto User { get; set; }
    }
}
