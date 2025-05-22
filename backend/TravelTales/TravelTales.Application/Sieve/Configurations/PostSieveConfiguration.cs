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

            mapper.Property<Post>(x => x.Tags)
                .CanFilter()
                .CanSort();

            mapper.Property<Post>(x => x.CountryId)
            .CanFilter()
            .CanSort();

            mapper.Property<Post>(x => x.CityId)
                .CanFilter()
                .CanSort();

            mapper.Property<Post>(p => p.Country.Name)
            .CanFilter()
            .CanSort()
            .HasName("CountryName");

            mapper.Property<Post>(p => p.City.Name)
                .CanFilter()
                .CanSort()
                .HasName("CityName");

            //mapper.Property<Post>(p => p.Categories.Name)
            //    .CanFilter()
            //    .CanSort()
            //    .HasName("CityName");

            mapper.Property<Post>(x => x.CreatedAt)
                .CanFilter()
                .CanSort();
        }
    }
}
