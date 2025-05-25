using TravelTales.Application.DTOs.Attachment;
using TravelTales.Application.DTOs.Blogger;
using TravelTales.Application.DTOs.Category;
using TravelTales.Application.DTOs.City;
using TravelTales.Application.DTOs.Comment;
using TravelTales.Application.DTOs.Country.TravelTales.Application.DTOs.Location;
using TravelTales.Application.DTOs.PostLike;
using TravelTales.Domain.Enums;

namespace TravelTales.Application.DTOs.Post
{
    public class PostDto
    {
        public long Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public long BloggerId { get; set; }
        public BloggerShortInfoDto Blogger { get; set; }
        public ICollection<CategoryShortInfoDto>? Categories { get; set; }
        public long? CityId { get; set; }
        public CityDto City { get; set; }
        public long? CountryId { get; set; }
        public CountryDto Country { get; set; }
        public BudgetLevel? Budget { get; set; }
        public ICollection<AttachmentDto>? Attachments { get; set; }
        public ICollection<PostLikeDto>? Likes { get; set; }
        public ICollection<CommentBroadcastDto>? Comments { get; set; }
        public ICollection<string> Tags { get; set; } = new List<string>();
        public DateTime? CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }
        public bool IsDeleted { get; set; }
    }
}
