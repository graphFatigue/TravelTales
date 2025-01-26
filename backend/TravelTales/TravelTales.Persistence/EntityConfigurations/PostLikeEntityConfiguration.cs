using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TravelTales.Domain.Entities;

namespace TravelTales.Persistence.EntityConfigurations
{
    public class PostLikeEntityConfiguration : IEntityTypeConfiguration<PostLike>
    {
        public void Configure(EntityTypeBuilder<PostLike> builder)
        {
            builder.ToTable("likes");

            ArgumentNullException.ThrowIfNull(builder);

            builder.HasKey(l => new { l.BloggerId, l.PostId });

            builder.Property(l => l.BloggerId)
                   .HasColumnName("blogger_id");

            builder.Property(l => l.PostId)
                   .HasColumnName("post_id");

            builder
                .HasOne(l => l.Blogger)
                .WithMany()
                .HasForeignKey(l => l.BloggerId)
                .OnDelete(DeleteBehavior.SetNull); // Set BloggerId to null when Blogger is deleted

            builder
                .HasOne(l => l.Post)
                .WithMany(p => p.Likes)
                .HasForeignKey(l => l.PostId)
                .OnDelete(DeleteBehavior.Cascade); // Cascade delete when Post is deleted
        }
    }
}
