using TravelTales.Application.DTOs.City;
using TravelTales.Application.DTOs.Country.TravelTales.Application.DTOs.Location;
using TravelTales.Application.DTOs.Enums;
using TravelTales.Application.DTOs.Post;
using TravelTales.Application.DTOs.User;

namespace TravelTales.Application.DTOs.Blogger
{
    public class BloggerDto
    {
        public long Id { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public DateTime? BirthDate { get; set; }
        public Sex? Sex { get; set; }
        public string? Bio { get; set; }
        public string? Image { get; set; }
        public Guid UserId { get; set; }
        public int FollowerCount { get; set; }
        public int FollowingCount { get; set; }
        public bool IsFollowing { get; set; }
        //public UserDto User { get; set; }
        public long? CityId { get; set; }
        public CityDto City { get; set; }
        public long? CountryId { get; set; }
        public CountryDto Country { get; set; }
        public ICollection<PostDto>? Posts { get; set; }
        public ICollection<CityDto> VisitedCities { get; set; } = new List<CityDto>();
        public ICollection<CountryDto> VisitedCountries { get; set; } = new List<CountryDto>();
        public DateTime? CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }
        public bool IsDeleted { get; set; }
    }
}
