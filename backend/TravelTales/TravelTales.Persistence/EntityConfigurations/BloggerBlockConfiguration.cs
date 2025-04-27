using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using TravelTales.Domain.Entities;

namespace TravelTales.Persistence.EntityConfigurations
{
    public class BloggerBlockConfiguration : IEntityTypeConfiguration<BloggerBlock>
    {
        public void Configure(EntityTypeBuilder<BloggerBlock> builder)
        {
            builder.ToTable("blogger_blocks");

            ArgumentNullException.ThrowIfNull(builder);

            // Composite primary key on BlockerId + BlockedId
            builder.HasKey(bb => new { bb.BlockerId, bb.BlockedId });

            builder
                .Property(bb => bb.BlockerId)
                .HasColumnName("blocker_id");

            builder
                .Property(bb => bb.BlockedId)
                .HasColumnName("blocked_id");

            // Configure relationship: one Blogger (Blocker) can block many others
            builder.HasOne(bb => bb.Blocker)
                   .WithMany(b => b.BlockedBloggers)         // collection on Blogger
                   .HasForeignKey(bb => bb.BlockerId)
                   .OnDelete(DeleteBehavior.Restrict);

            // Configure relationship: one Blogger (Blocked) can be blocked by many others
            builder.HasOne(bb => bb.Blocked)
                   .WithMany(b => b.BlockedByBloggers)      // collection on Blogger
                   .HasForeignKey(bb => bb.BlockedId)
                   .OnDelete(DeleteBehavior.Restrict);

            // (Optional) Add any additional constraints or indexes if needed.
        }
    }

}
