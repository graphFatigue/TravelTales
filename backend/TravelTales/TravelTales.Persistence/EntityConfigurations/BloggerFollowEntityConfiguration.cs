using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TravelTales.Domain.Entities;

namespace TravelTales.Persistence.EntityConfigurations
{
    public class BloggerFollowEntityConfiguration : IEntityTypeConfiguration<BloggerFollow>
    {
        public void Configure(EntityTypeBuilder<BloggerFollow> builder)
        {
            builder.ToTable("blogger_follows");

            builder.HasKey(bf => bf.Id);
            builder.Property(bf => bf.Id).HasColumnName("blogger_follow_id");

            builder.Property(bf => bf.CreatedAt).HasColumnName("created_at");
            builder.Property(bf => bf.ModifiedAt).HasColumnName("modified_at");
            builder.Property(bf => bf.IsDeleted).HasColumnName("is_deleted");

            builder.HasOne(bf => bf.Follower)
                .WithMany(b => b.Following)
                .HasForeignKey(bf => bf.FollowerId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(bf => bf.Following)
                .WithMany(b => b.Followers)
                .HasForeignKey(bf => bf.FollowingId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}