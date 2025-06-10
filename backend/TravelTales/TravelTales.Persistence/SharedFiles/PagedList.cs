using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using Sieve.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TravelTales.Persistence.SharedFiles
{
    public class PagedList<TEntity>
    {
        public PagedList(
            IEnumerable<TEntity> items,
            int count,
            int pageNumber,
            int pageSize)
        {
            this.TotalCount = count;
            this.PageSize = pageSize;
            this.CurrentPage = pageNumber;
            this.TotalPages = (int)Math.Ceiling(this.TotalCount / (double)this.PageSize);
            this.Items = items;
        }

        public PagedList()
        {
            this.Items = [];
        }

        public IEnumerable<TEntity>? Items { get; set; }

        public int CurrentPage { get; set; }

        public int TotalPages { get; set; }

        public int PageSize { get; set; }

        public int TotalCount { get; set; }

        public bool HasPrevious => this.CurrentPage > 1;

        public bool HasNext => this.CurrentPage < this.TotalPages;

        public static PagedList<TEntity> Copy<TIn>(PagedList<TIn> pagedList, IEnumerable<TEntity> mappedModels)
        {
            if (pagedList == null) throw new ArgumentNullException(nameof(pagedList));

            return new PagedList<TEntity>
            {
                Items = mappedModels,
                CurrentPage = pagedList.CurrentPage,
                TotalPages = pagedList.TotalPages,
                PageSize = pagedList.PageSize,
                TotalCount = pagedList.TotalCount
            };
        }

        public static async Task<PagedList<TEntity>> ToPagedListAsync(
            IQueryable<TEntity> source,
            SieveModel sieveModel)
        {
            ValidateToPagedListParameters(sieveModel);
            return await CreatePagedListAsync(source, sieveModel);
        }

        private static void ValidateToPagedListParameters(SieveModel sieveModel)
        {
            ArgumentNullException.ThrowIfNull(sieveModel);
        }

        public static async Task<PagedList<TEntity>> CreatePagedListAsync(
            IQueryable<TEntity> source,
            SieveModel sieveModel,
            CancellationToken cancellationToken = default)
        {
            if (sieveModel == null)
                throw new ArgumentNullException(nameof(sieveModel));

            // Determine whether EF Core can do async
            bool isAsyncProvider = (source.Provider is IAsyncQueryProvider);

            int count;
            List<TEntity> items = new List<TEntity>();

            if (isAsyncProvider)
            {
                // EF Core async path
                count = await source.CountAsync(cancellationToken).ConfigureAwait(false);

                sieveModel.Page ??= 1;
                sieveModel.PageSize ??= (count == 0 ? 1 : count);

                int skip = (sieveModel.Page.Value - 1) * sieveModel.PageSize.Value;
                items = await source
                    .Skip(skip)
                    .Take(sieveModel.PageSize.Value)
                    .ToListAsync(cancellationToken)
                    .ConfigureAwait(false);
            }
            else
            {
                // In‐memory fallback path (e.g. after AsEnumerable)
                count = source.Count();

                sieveModel.Page ??= 1;
                sieveModel.PageSize ??= (count == 0 ? 1 : count);

                int skip = (sieveModel.Page.Value - 1) * sieveModel.PageSize.Value;
                if (source != null)
                {
                    items = source
                        .Skip(skip)
                        .Take(sieveModel.PageSize.Value)
                        .ToList();
                }

            }

            return new PagedList<TEntity>(items, count, sieveModel.Page.Value, sieveModel.PageSize.Value);
        }
    }
}
