using Sieve.Services;
using TravelTales.Domain.Entities;

namespace TravelTales.Application.Sieve.Configurations
{
    public class PostSieveConfiguration : ISieveConfiguration
    {
        public void Configure(SievePropertyMapper mapper)
        {
            ArgumentNullException.ThrowIfNull(mapper);

            mapper.Property<Post>(x => x.Title)
                .CanFilter()
                .CanSort();

            mapper.Property<Post>(x => x.BloggerId)
                .CanFilter();
                //.CanSort();

            mapper.Property<Post>(x => x.CreatedAt)
                .CanFilter()
                .CanSort();
        }
    }
}
