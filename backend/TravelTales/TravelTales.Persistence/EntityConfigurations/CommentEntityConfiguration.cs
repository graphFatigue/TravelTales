using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TravelTales.Domain.Entities;

namespace TravelTales.Persistence.EntityConfigurations
{
    public class CommentEntityConfiguration : IEntityTypeConfiguration<Comment>
    {
        public void Configure(EntityTypeBuilder<Comment> builder)
        {
            builder.ToTable("comments");

            ArgumentNullException.ThrowIfNull(builder);

            builder.HasKey(u => u.Id);

            builder
                .Property(u => u.Id)
                .HasColumnName("comment_id");

            builder.Property(l => l.BloggerId)
                   .HasColumnName("blogger_id");

            builder.Property(l => l.PostId)
                   .HasColumnName("post_id");

            builder
                .Property(p => p.Content)
                .IsRequired()
                .HasMaxLength(1000)
                .HasColumnName("content");

            builder
                .Property(p => p.CreatedAt)
                .HasColumnName("created_at");

            builder
                .Property(p => p.ModifiedAt)
                .HasColumnName("modified_at");

            builder
                .Property(p => p.IsDeleted)
                .HasColumnName("is_deleted");

            builder.HasOne(c => c.Post)
                .WithMany(p => p.Comments)
                .HasForeignKey(c => c.PostId)
                .OnDelete(DeleteBehavior.ClientCascade);  

            builder.HasOne(c => c.Blogger)
                .WithMany()
                .HasForeignKey(c => c.BloggerId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}
