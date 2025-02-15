using TravelTales.Domain.Entities.Abstract;

namespace TravelTales.Domain.Entities
{
    public class Attachment: IEntityBase<long>
    {
        public long Id { get; set; }
        public long PostId { get; set; }
        public Post Post { get; set; }
        public string FileLink {  get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }
        public bool IsDeleted { get; set; }
    }
}
