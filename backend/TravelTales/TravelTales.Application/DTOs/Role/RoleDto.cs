namespace TravelTales.Application.DTOs.Role
{
    public class RoleDto
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public DateTime? CreatedAt { get; set; }

        public DateTime? ModifiedAt { get; set; }

        public bool IsDeleted { get; set; }
    }
}
