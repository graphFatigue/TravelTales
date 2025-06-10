namespace TravelTales.Application.DTOs.Comment
{
    public class CreateCommentDto
    {
        public string Content { get; set; }
        public long PostId { get; set; }
    }
}
