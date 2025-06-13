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

            builder.HasKey(l => l.Id);

            builder.Property(l => l.Id)
                .HasColumnName("like_id");

            builder.Property(l => l.BloggerId)
                .HasColumnName("blogger_id");

            builder.Property(l => l.PostId)
                .HasColumnName("post_id");

            // Relationships
            builder.HasOne(l => l.Blogger)
                .WithMany()
                .HasForeignKey(l => l.BloggerId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(l => l.Post)
                .WithMany(p => p.Likes)
                .HasForeignKey(l => l.PostId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(l => l.Notification)
                .WithOne(n => n.PostLike)
                .HasForeignKey<Notification>(n => n.LikeId)
                .OnDelete(DeleteBehavior.ClientCascade);
        }
    }
}