using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TravelTales.Domain.Entities;

namespace TravelTales.Persistence.EntityConfigurations
{
    public class UserEntityConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.ToTable("users");

            builder
               .Property(u => u.Id)
               .HasColumnName("user_id");

            builder
                .Property(p => p.CreatedAt)
                .HasColumnName("created_at");

            builder
                .Property(p => p.ModifiedAt)
                .HasColumnName("modified_at");

            builder
                .Property(p => p.IsDeleted)
                .HasColumnName("is_deleted");

            builder
               .HasOne(u => u.Blogger)
               .WithOne(b => b.User)
               .HasForeignKey<Blogger>(b => b.UserId)
               .OnDelete(DeleteBehavior.Cascade); // User deletion cascades to Blogger
        }
    }
}
