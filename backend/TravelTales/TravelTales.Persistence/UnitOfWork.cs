using TravelTales.Persistence.Interfaces;
using Microsoft.Extensions.DependencyInjection;

namespace TravelTales.Persistence
{
    public sealed class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext dbContext;
        private readonly IServiceProvider serviceProvider;
        private readonly Dictionary<string, object> repositories;

        public UnitOfWork(
            AppDbContext dbContext,
            IServiceProvider serviceProvider)
        {
            this.dbContext = dbContext;
            this.serviceProvider = serviceProvider;
            this.repositories = new Dictionary<string, object>();
        }

        public int SaveChanges()
        {
            return this.dbContext.SaveChanges();
        }

        public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            return this.dbContext.SaveChangesAsync(cancellationToken);
        }

        T IUnitOfWork.GetRepository<T>()
        {
            var typeName = typeof(T).Name;

            if (!this.repositories.ContainsKey(typeName))
            {
                var instance = this.serviceProvider.GetService<T>();
                if (instance is not null)
                {
                    this.repositories.Add(typeName, instance);
                }
            }

            return (T)this.repositories[typeName];
        }

        public void Dispose()
        {
            this.dbContext.Dispose();
            this.repositories.Clear();
        }
    }
}
