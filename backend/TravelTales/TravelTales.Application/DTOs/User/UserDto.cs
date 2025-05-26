using TravelTales.Application.DTOs.Blogger;

namespace TravelTales.Application.DTOs.User
{
    public class UserDto
    {
        public Guid Id { get; set; }

        public string Email { get; set; }
        public string? RoleName { get; set; }
        public BloggerDto Blogger { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }
        public bool IsDeleted { get; set; }
    }
}
