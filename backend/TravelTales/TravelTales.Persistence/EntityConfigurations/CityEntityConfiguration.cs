using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using TravelTales.Domain.Entities;

namespace TravelTales.Persistence.EntityConfigurations
{
    public class CityEntityConfiguration : IEntityTypeConfiguration<City>
    {
        public void Configure(EntityTypeBuilder<City> builder)
        {
            builder.ToTable("cities");
            builder.HasKey(c => c.Id);
            builder.Property(c => c.Id).HasColumnName("city_id");
            builder.Property(c => c.Name).IsRequired().HasMaxLength(100);
            builder.HasOne(c => c.Country)
                .WithMany(c => c.Cities)
                .HasForeignKey(c => c.CountryId);
        }
    }
}
