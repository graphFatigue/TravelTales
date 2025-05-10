using TravelTales.Domain.Entities.Abstract;
using TravelTales.Domain.Enums;

namespace TravelTales.Domain.Entities
{
    public class Post : IEntityBase<long>
    {
        public Post()
        {
            Categories = new List<Category>();
            Attachments = new List<Attachment>();
            Likes = new List<PostLike>();
            Comments = new List<Comment>();
        }

        public long Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public long? BloggerId { get; set; }
        public Blogger Blogger { get; set; }
        public long? CityId { get; set; }
        public City? City { get; set; }
        public long? CountryId { get; set; }
        public Country? Country { get; set; }
        public BudgetLevel? Budget { get; set; }
        public ICollection<Attachment>? Attachments { get; }
        public ICollection<Category>? Categories { get; }
        public ICollection<PostLike>? Likes { get; }
        public ICollection<Comment>? Comments { get; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }
        public bool IsDeleted { get; set; }
    }
}
