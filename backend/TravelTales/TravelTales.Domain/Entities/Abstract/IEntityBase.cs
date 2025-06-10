namespace TravelTales.Domain.Entities.Abstract
{
    /// <summary>
    /// Defines the base entity interface with common properties.
    /// </summary>
    /// <typeparam name="TEntity">The type of the entity identifier.</typeparam>
    public interface IEntityBase<TEntity>
        where TEntity : struct
    {
        /// <summary>
        /// Gets or sets the unique identifier for the entity.
        /// </summary>
        public TEntity Id { get; set; }

        /// <summary>
        /// Gets or sets the creation date of the entity.
        /// </summary>
        public DateTime? CreatedAt { get; set; }

        /// <summary>
        /// Gets or sets the last modified date of the entity.
        /// </summary>
        public DateTime? ModifiedAt { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether the entity is marked as deleted.
        /// </summary>
        public bool IsDeleted { get; set; }
    }
}
