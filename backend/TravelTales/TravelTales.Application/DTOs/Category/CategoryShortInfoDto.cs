using TravelTales.Application.DTOs.Post;

namespace TravelTales.Application.DTOs.Category
{
    public class CategoryShortInfoDto
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string NameUa { get; set; }
        public string DescriptionUa { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }
        public bool IsDeleted { get; set; }
    }
}
