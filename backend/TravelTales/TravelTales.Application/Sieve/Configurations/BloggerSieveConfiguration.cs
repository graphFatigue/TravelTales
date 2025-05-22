using Sieve.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TravelTales.Domain.Entities;

namespace TravelTales.Application.Sieve.Configurations
{
    public class BloggerSieveConfiguration : ISieveConfiguration
    {
        public void Configure(SievePropertyMapper mapper)
        {
            ArgumentNullException.ThrowIfNull(mapper);

            mapper.Property<Blogger>(x => x.FirstName)
                .CanFilter()
                .CanSort();

            mapper.Property<Blogger>(x => x.LastName)
                .CanFilter()
                .CanSort();

            mapper.Property<Blogger>(x => x.CountryId)
                .CanFilter()
                .CanSort();

            mapper.Property<Blogger>(x => x.CityId)
                .CanFilter()
                .CanSort();

            mapper.Property<Blogger>(p => p.Country.Name)
            .CanFilter()
            .CanSort()
            .HasName("CountryName");

            mapper.Property<Blogger>(p => p.City.Name)
                .CanFilter()
                .CanSort()
                .HasName("CityName");
        }
    }
}
