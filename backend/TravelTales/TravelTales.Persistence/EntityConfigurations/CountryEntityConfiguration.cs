using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using TravelTales.Domain.Entities;

namespace TravelTales.Persistence.EntityConfigurations
{
    public class CountryEntityConfiguration : IEntityTypeConfiguration<Country>
    {
        public void Configure(EntityTypeBuilder<Country> builder)
        {
            builder.ToTable("countries");
            builder.HasKey(c => c.Id);
            builder.Property(c => c.Id).HasColumnName("country_id");
            builder.Property(c => c.Name).IsRequired().HasMaxLength(100);
            builder.Property(c => c.Iso2).IsRequired().HasMaxLength(2);
            builder.Property(c => c.Iso3).IsRequired().HasMaxLength(3);
        }
    }
}
