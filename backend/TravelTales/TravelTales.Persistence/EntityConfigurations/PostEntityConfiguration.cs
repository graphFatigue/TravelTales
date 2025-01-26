using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using TravelTales.Domain.Entities;

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
                .Property(p => p.CreatedAt)
                .HasColumnName("created_at");

            builder
                .Property(p => p.ModifiedAt)
                .HasColumnName("modified_at");

            builder
                .Property(p => p.IsDeleted)
                .HasColumnName("is_deleted");

            builder
                .HasOne(p => p.Blogger)
                .WithMany(u => u.Posts)
                .HasForeignKey(p => p.BloggerId)
                .OnDelete(DeleteBehavior.SetNull); // Blogger deletion sets BloggerId in Post to null
        }
    }
}
