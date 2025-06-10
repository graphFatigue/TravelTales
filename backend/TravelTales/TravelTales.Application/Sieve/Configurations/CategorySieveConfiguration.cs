using Sieve.Services;
using TravelTales.Domain.Entities;

namespace TravelTales.Application.Sieve.Configurations
{
    public class CategorySieveConfiguration : ISieveConfiguration
    {
        public void Configure(SievePropertyMapper mapper)
        {
            ArgumentNullException.ThrowIfNull(mapper);

            mapper.Property<Category>(x => x.Name)
                .CanFilter()
                .CanSort();
        }
    }
}
