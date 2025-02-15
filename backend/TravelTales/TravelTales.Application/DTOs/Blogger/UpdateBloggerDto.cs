using TravelTales.Application.DTOs.Enums;

namespace TravelTales.Application.DTOs.Blogger
{
    public class UpdateBloggerDto
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public DateTime BirthDate { get; set; }
        public Sex Sex { get; set; }
        public string? Bio { get; set; }
        //public string? Image { get; set; }
    }
}
