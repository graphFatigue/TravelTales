namespace TravelTales.Application.DTOs.Comment
{
    public class CommentBroadcastDto
    {
        public long Id { get; set; }
        public string Content { get; set; }
        public long PostId { get; set; }
        public long BloggerId { get; set; }
        public string BloggerName { get; set; }
        public string? BloggerImage { get; set; }
        public long PostAuthorBloggerId { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }
        public bool IsDeleted { get; set; }
    }
}
