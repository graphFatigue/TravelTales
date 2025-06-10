using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using TravelTales.Domain.Entities;

public class CategoryEntityConfiguration : IEntityTypeConfiguration<Category>
{
    public void Configure(EntityTypeBuilder<Category> builder)
    {
        builder.ToTable("categories");

        builder.HasKey(c => c.Id);
        builder.Property(c => c.Id).HasColumnName("category_id");

        builder.Property(c => c.Name)
            .IsRequired()
            .HasMaxLength(100)
            .HasColumnName("name");

        builder.Property(c => c.Description)
            .HasMaxLength(500)
            .HasColumnName("description");

        builder.Property(c => c.NameUa)
            .IsRequired()
            .HasMaxLength(100)
            .HasColumnName("name_ua");

        builder.Property(c => c.DescriptionUa)
            .HasMaxLength(500)
            .HasColumnName("description_ua");

        builder.Property(c => c.CreatedAt)
            .HasColumnName("created_at");

        builder.Property(c => c.ModifiedAt)
            .HasColumnName("modified_at");

        builder.Property(c => c.IsDeleted)
            .HasColumnName("is_deleted");
    }
}