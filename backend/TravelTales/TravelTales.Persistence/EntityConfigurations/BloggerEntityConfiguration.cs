using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TravelTales.Domain.Entities;
using TravelTales.Domain.Enums;

namespace TravelTales.Persistence.EntityConfigurations
{
    public class BloggerEntityConfiguration : IEntityTypeConfiguration<Blogger>
    {
        public void Configure(EntityTypeBuilder<Blogger> builder)
        {
            builder.ToTable("bloggers");

            ArgumentNullException.ThrowIfNull(builder);

            builder.HasKey(u => u.Id);

            builder
                .Property(u => u.Id)
                .HasColumnName("blogger_id");

            builder
                .Property(u => u.FirstName)
                .IsRequired()
                .HasMaxLength(30)
                .HasColumnName("first_name");

            builder
                .Property(u => u.LastName)
                .IsRequired()
                .HasMaxLength(40)
                .HasColumnName("last_name");

            builder
                .Property(u => u.Bio)
                .HasMaxLength(1000)
                .HasColumnName("bio");

            builder
                .Property(u => u.BirthDate)
                .IsRequired()
                .HasColumnName("birth_date");

            builder
                .Property(u => u.Sex)
                .IsRequired()
                .HasColumnName("sex")
                .HasDefaultValue(Sex.Other);

            builder
                .Property(u => u.CreatedAt)
                .HasColumnName("created_at");

            builder
                .Property(u => u.ModifiedAt)
                .HasColumnName("modified_at");

            builder
                .Property(u => u.IsDeleted)
                .HasColumnName("is_deleted");

            builder
               .HasMany(u => u.Posts)
               .WithOne(p => p.Blogger)
               .HasForeignKey(p => p.BloggerId)
               .OnDelete(DeleteBehavior.SetNull); // Blogger deletion sets BloggerId in Post to null

            builder
               .HasOne(b => b.User)
               .WithOne(u => u.Blogger)
               .HasForeignKey<Blogger>(b => b.UserId)
               .OnDelete(DeleteBehavior.NoAction); // Blogger deletion does not delete User
        }
    }
}
