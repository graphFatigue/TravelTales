using Sieve.Services;
using TravelTales.Domain.Entities;
using TravelTales.Persistence.Interfaces;

namespace TravelTales.Persistence.Repositories
{
    public class CategoryRepository : GenericRepository<Category, long>, ICategoryRepository
    {
        public CategoryRepository(AppDbContext context, ISieveProcessor sieveProcessor)
            : base(context, sieveProcessor)
        {
        }
    }
}
