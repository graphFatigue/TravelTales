using Sieve.Services;
using TravelTales.Domain.Entities;

namespace TravelTales.Application.Sieve.Configurations
{
    public class NotificationSieveConfiguration : ISieveConfiguration
    {
        public void Configure(SievePropertyMapper mapper)
        {
            mapper.Property<Notification>(x => x.CreatedAt)
                .CanFilter()
                .CanSort();

            mapper.Property<Notification>(x => x.RecipientBloggerId)
                .CanFilter()
                .CanSort();
        }
    }
}
