using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using TravelTales.Domain.Entities;
using TravelTales.Domain.Enums;
using System.Text.Json;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace TravelTales.Persistence.EntityConfigurations
{
    public class PostEntityConfiguration : IEntityTypeConfiguration<Post>
    {
        public void Configure(EntityTypeBuilder<Post> builder)
        {
            builder.ToTable("posts");

            ArgumentNullException.ThrowIfNull(builder);

            builder.HasKey(p => p.Id);

            builder
                .Property(p => p.Id)
                .HasColumnName("post_id");

            builder
                .Property(p => p.Title)
                .IsRequired()
                .HasMaxLength(150)
                .HasColumnName("title");

            builder
                .Property(p => p.Content)
                .IsRequired()
                .HasMaxLength(2000)
                .HasColumnName("content");

            builder
                .Property(p => p.BloggerId)
                .HasColumnName("blogger_id");

            builder
                .Property(p => p.Budget)
                .HasColumnName("budget_level")
                .HasConversion<string>()
                .HasColumnType("integer")
                .HasDefaultValue(BudgetLevel.NotSpecified);

            builder.Property(p => p.Tags)
                .HasConversion(
                    v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),
                    v => JsonSerializer.Deserialize<ICollection<string>>(v, (JsonSerializerOptions)null) ?? new List<string>(),
                    new ValueComparer<ICollection<string>>(
                        (c1, c2) => c1.SequenceEqual(c2),
                        c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
                        c => c.ToList()
                    )
                )
                .HasColumnType("nvarchar(max)")
                .HasColumnName("tags")
                .HasDefaultValue(new List<string>());

            builder
                .Property(p => p.CreatedAt)
                .HasColumnName("created_at");

            builder
                .Property(p => p.ModifiedAt)
                .HasColumnName("modified_at");

            builder
                .Property(p => p.IsDeleted)
                .HasColumnName("is_deleted");

            builder.HasOne(p => p.City)
                .WithMany()
                .HasForeignKey(p => p.CityId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(p => p.Country)
                .WithMany()
                .HasForeignKey(p => p.CountryId)
                .OnDelete(DeleteBehavior.Restrict);

            builder
               .HasOne(p => p.Blogger)
               .WithMany(u => u.Posts)
               .HasForeignKey(p => p.BloggerId)
               .OnDelete(DeleteBehavior.SetNull); // Blogger deletion sets BloggerId in Post to null

            // Configure many-to-many with Category
            builder.HasMany(p => p.Categories)
                .WithMany(c => c.Posts)
                .UsingEntity(j => j.ToTable("posts_categories"));
        }
    }
}
