using TravelTales.Application.DTOs.Post;

namespace TravelTales.Application.DTOs.Blogger
{
    public class BloggerStatsDto
    {
        public long BloggerId { get; set; }
        public int TotalLikes { get; set; }
        public int TotalComments { get; set; }
        public PostDto? MostPopularPost { get; set; }
    }
}
