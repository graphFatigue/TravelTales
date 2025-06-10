using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TravelTales.Domain.Entities;

namespace TravelTales.Persistence.EntityConfigurations
{
    public class NotificationEntityConfiguration : IEntityTypeConfiguration<Notification>
    {
        public void Configure(EntityTypeBuilder<Notification> builder)
        {
            builder.ToTable("notifications");

            builder.HasKey(n => n.Id);

            builder.Property(n => n.Id)
                .HasColumnName("notification_id");

            builder.Property(n => n.Message)
                .IsRequired()
                .HasMaxLength(500)
                .HasColumnName("message");

            builder.Property(n => n.IsRead)
                .HasDefaultValue(false)
                .HasColumnName("is_read");

            // Relationships
            builder.HasOne(n => n.RecipientBlogger)
                .WithMany()
                .HasForeignKey(n => n.RecipientBloggerId)
                .OnDelete(DeleteBehavior.ClientCascade);

            builder.HasOne(n => n.TriggeredByBlogger)
                .WithMany()
                .HasForeignKey(n => n.TriggeredByBloggerId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(n => n.Post)
                .WithMany()
                .HasForeignKey(n => n.PostId)
                .OnDelete(DeleteBehavior.ClientCascade);

            builder.HasOne(n => n.Comment)
                .WithMany()
                .HasForeignKey(n => n.CommentId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasOne(n => n.PostLike)
                .WithMany()
                .HasForeignKey(n => n.LikeId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.Property(p => p.CreatedAt)
                .HasColumnName("created_at");

            builder.Property(p => p.ModifiedAt)
                .HasColumnName("modified_at");

            builder.Property(p => p.IsDeleted)
                .HasColumnName("is_deleted");
        }
    }
}