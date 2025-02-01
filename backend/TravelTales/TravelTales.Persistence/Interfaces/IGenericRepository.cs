using Sieve.Models;
using TravelTales.Domain.Entities.Abstract;
using TravelTales.Persistence.SharedFiles;

namespace TravelTales.Persistence.Interfaces
{
    public interface IGenericRepository<TEntity, TEntityId>
            where TEntity : IEntityBase<TEntityId>
            where TEntityId : struct
    {
        IQueryable<TEntity> AsQueryable();

        Task<List<TEntity>> GetAllAsync(CancellationToken cancellationToken = default);

        Task<TEntity?> GetByIdAsync(TEntityId id, CancellationToken cancellationToken = default);

        Task AddAsync(TEntity entity, CancellationToken cancellationToken = default);

        void Update(TEntity entity);

        void Delete(TEntity entity);

        Task<PagedList<TEntity>> GetAllWithFilterAsync(SieveModel sieveModel, CancellationToken cancellationToken = default);
    }
}
