using Microsoft.EntityFrameworkCore;
using Sieve.Models;
using Sieve.Services;
using TravelTales.Domain.Entities.Abstract;
using TravelTales.Persistence.Interfaces;
using TravelTales.Persistence.SharedFiles;

namespace TravelTales.Persistence.Repositories
{
    public class GenericRepository<TEntity, TEntityId> : IGenericRepository<TEntity, TEntityId>
        where TEntity : class, IEntityBase<TEntityId>
        where TEntityId : struct
    {
        protected readonly DbSet<TEntity> DbSet;

        protected readonly ISieveProcessor sieveProcessor;

        private readonly AppDbContext context;

        public GenericRepository(AppDbContext context, ISieveProcessor sieveProcessor)
        {
            this.context = context;
            this.DbSet = this.context.Set<TEntity>();
            this.sieveProcessor = sieveProcessor;
        }

        public IQueryable<TEntity> AsQueryable()
        {
            return this.DbSet.AsQueryable();
        }

        public virtual async Task<List<TEntity>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            return await this.DbSet.Where(x => !x.IsDeleted).ToListAsync(cancellationToken);
        }

        public IQueryable<TEntity> GetAllAsQueryable()
        {
            return this.DbSet.AsQueryable();
        }

        public virtual async Task<PagedList<TEntity>> GetAllWithFilterAsync(SieveModel sieveModel, CancellationToken cancellationToken = default)
        {
            ValidateGetAllWithFilterParameters(sieveModel);

            IQueryable<TEntity> entities = sieveModel.Page == null && sieveModel.PageSize == null
                ? this.sieveProcessor.Apply(sieveModel, this.DbSet.AsQueryable(), applyPagination: false)
                : this.sieveProcessor.Apply(sieveModel, this.DbSet.AsQueryable());

            return await PagedList<TEntity>.ToPagedListAsync(entities, sieveModel);
        }

        public virtual async Task<TEntity?> GetByIdAsync(TEntityId id, CancellationToken cancellationToken = default)
        {
            ValidateGetByIdParameters(id);
            return await this.DbSet.FirstOrDefaultAsync(x => x.Id.Equals(id) && !x.IsDeleted, cancellationToken);
        }

        public virtual async Task AddAsync(TEntity entity, CancellationToken cancellationToken = default)
        {
            ValidateUpdateAndCreateParameters(entity);

            entity.IsDeleted = false;
            entity.CreatedAt = DateTime.Now;
            entity.ModifiedAt = DateTime.Now;
            await this.context.AddAsync(entity, cancellationToken);
        }

        public virtual void Update(TEntity entity)
        {
            ValidateUpdateAndCreateParameters(entity);

            entity.ModifiedAt = DateTime.Now;
            this.context.Update(entity);
        }

        public virtual void Delete(TEntity entity)
        {
            this.context.Remove(entity);
        }

        private static void ValidateGetByIdParameters(TEntityId id)
        {
            ArgumentNullException.ThrowIfNull(id);
        }

        private static void ValidateGetAllWithFilterParameters(SieveModel sieveModel)
        {
            ArgumentNullException.ThrowIfNull(sieveModel);
        }

        private static void ValidateUpdateAndCreateParameters(TEntity entity)
        {
            ArgumentNullException.ThrowIfNull(entity);
        }
    }
}
