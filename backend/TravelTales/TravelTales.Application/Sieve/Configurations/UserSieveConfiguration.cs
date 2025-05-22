using Sieve.Services;
using TravelTales.Domain.Entities;

namespace TravelTales.Application.Sieve.Configurations
{
    public class UserSieveConfiguration : ISieveConfiguration
    {
        public void Configure(SievePropertyMapper mapper)
        {
            mapper.Property<User>(x => x.Id)
                .CanFilter()
                .CanSort();

            mapper.Property<User>(x => x.Email)
                .CanFilter()
                .CanSort();

            mapper.Property<User>(x => x.Blogger.FirstName)
                .CanFilter()
                .CanSort();

            mapper.Property<User>(x => x.Blogger.LastName)
                .CanFilter()
                .CanSort();
        }
    }
}
