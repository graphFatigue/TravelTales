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
               .OnDelete(DeleteBehavior.SetNull);

            builder
               .HasOne(b => b.User)
               .WithOne(u => u.Blogger)
               .HasForeignKey<Blogger>(b => b.UserId)
               .OnDelete(DeleteBehavior.NoAction);

            builder.HasMany(b => b.VisitedCities)
               .WithMany()
               .UsingEntity(j => j.ToTable("blogger_visited_cities"));

            builder.HasMany(b => b.VisitedCountries)
                .WithMany()
                .UsingEntity(j => j.ToTable("blogger_visited_countries"));

            builder.HasMany(b => b.Followers)
                .WithOne(bf => bf.Following)
                .HasForeignKey(bf => bf.FollowingId);

            builder.HasMany(b => b.Following)
                .WithOne(bf => bf.Follower)
                .HasForeignKey(bf => bf.FollowerId);

            builder.HasMany(b => b.BlockedBloggers)
                .WithOne(bf => bf.Blocker)
                .HasForeignKey(bf => bf.BlockerId);

            builder.HasMany(b => b.BlockedByBloggers)
                .WithOne(bf => bf.Blocked)
                .HasForeignKey(bf => bf.BlockedId);

            builder.HasOne(p => p.City)
                .WithMany()
                .HasForeignKey(p => p.CityId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(p => p.Country)
                .WithMany()
                .HasForeignKey(p => p.CountryId)
                .OnDelete(DeleteBehavior.Restrict);

        }
    }
}
