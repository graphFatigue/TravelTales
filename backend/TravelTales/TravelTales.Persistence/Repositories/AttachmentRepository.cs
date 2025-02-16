using Sieve.Services;
using TravelTales.Domain.Entities;
using TravelTales.Persistence.Interfaces;

namespace TravelTales.Persistence.Repositories
{
    public class AttachmentRepository : GenericRepository<Attachment, long>, IAttachmentRepository
    {
        public AttachmentRepository(AppDbContext context, ISieveProcessor sieveProcessor)
            : base(context, sieveProcessor)
        {
        }
    }
}
