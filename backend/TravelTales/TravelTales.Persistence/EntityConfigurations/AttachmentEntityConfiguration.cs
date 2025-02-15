using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TravelTales.Domain.Entities;

namespace TravelTales.Persistence.EntityConfigurations
{
    public class AttachmentEntityConfiguration : IEntityTypeConfiguration<Attachment>
    {
        public void Configure(EntityTypeBuilder<Attachment> builder)
        {
            builder.ToTable("attachments");

            ArgumentNullException.ThrowIfNull(builder);

            builder.HasKey(u => u.Id);

            builder
                .Property(u => u.Id)
                .HasColumnName("attachment_id");

            builder.Property(l => l.PostId)
                   .HasColumnName("post_id");

            builder
                .HasOne(l => l.Post)
                .WithMany(p => p.Attachments)
                .HasForeignKey(l => l.PostId)
                .OnDelete(DeleteBehavior.Cascade); // Cascade delete when Post is deleted
        }
    }
}
