using Microsoft.EntityFrameworkCore;
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
        private PagedList(
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

        private PagedList()
        {
        }

        public IEnumerable<TEntity>? Items { get; set; }

        public int CurrentPage { get; set; }

        public int TotalPages { get; set; }

        public int PageSize { get; set; }

        public int TotalCount { get; set; }

        public bool HasPrevious => this.CurrentPage > 1;

        public bool HasNext => this.CurrentPage < this.TotalPages;

        public static PagedList<TEntity> Copy<TIn>(
            PagedList<TIn> pagedList,
            IEnumerable<TEntity> mappedModels)
        {
            ArgumentNullException.ThrowIfNull(pagedList);

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

        private static async Task<PagedList<TEntity>> CreatePagedListAsync(
            IQueryable<TEntity> source,
            SieveModel sieveModel)
        {
            var count = await source.CountAsync();

            sieveModel.Page ??= 1;
            sieveModel.PageSize ??= count;

            var items = await source
                .Skip((sieveModel.Page!.Value - 1) * sieveModel.PageSize!.Value)
                .Take(sieveModel.PageSize.Value)
                .ToListAsync();

            return new PagedList<TEntity>(items, count, sieveModel.Page.Value, sieveModel.PageSize.Value);
        }
    }
}
