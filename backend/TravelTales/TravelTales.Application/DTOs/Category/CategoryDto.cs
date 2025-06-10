using TravelTales.Application.DTOs.Post;

namespace TravelTales.Application.DTOs.Category
{
    public class CategoryDto
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public ICollection<PostDto>? Posts { get; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }
        public bool IsDeleted { get; set; }
    }
}
