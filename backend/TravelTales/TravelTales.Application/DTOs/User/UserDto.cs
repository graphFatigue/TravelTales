using TravelTales.Application.DTOs.Blogger;

namespace TravelTales.Application.DTOs.User
{
    public class UserDto
    {
        public Guid Id { get; set; }
        public BloggerDto Blogger { get; set; }
    }
}
