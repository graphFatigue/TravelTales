using Newtonsoft.Json.Linq;
using Sieve.Services;
using TravelTales.Domain.Entities;

namespace TravelTales.Application.Sieve.Filters
{
    public class SieveCustomFilterMethods : ISieveCustomFilterMethods
    {

        public IQueryable<Post> CategoryName(IQueryable<Post> source, string op, string[] values)
        {
            if (values == null || values.Length == 0)
            {
                return source;
            }
            values = values[0].Split(' ');

            var categoriesToMatch = values
                .Where(v => !string.IsNullOrWhiteSpace(v))
                .Select(category => category.ToLower())
                .ToList();

            return source
                .AsEnumerable()
                .Where(post =>
                    categoriesToMatch.All(filterCategory =>
                        post.Categories != null &&
                        post.Categories.Any(category =>
                            category != null && category.Name.ToLower() == filterCategory
                        )
                    )
                )
            .AsQueryable();
        }

        public IQueryable<Post> CategoryNameUa(IQueryable<Post> source, string op, string[] values)
        {
            if (values == null || values.Length == 0)
            {
                return source;
            }
            values = values[0].Split(' ');

            var categoriesToMatch = values
                .Where(v => !string.IsNullOrWhiteSpace(v))
                .Select(category => category.ToLower())
                .ToList();

            return source
                .AsEnumerable()
                .Where(post =>
                    categoriesToMatch.All(filterCategory =>
                        post.Categories != null &&
                        post.Categories.Any(category =>
                            category != null && category.NameUa.ToLower() == filterCategory
                        )
                    )
                )
            .AsQueryable();
        }

        public IQueryable<Post> TagsFilter(IQueryable<Post> source, string op, string[] values)
        {
            if (values == null || values.Length == 0)
            {
                return source;
            }
            values = values[0].Split(' ');

            var tagsToMatch = values
                .Where(v => !string.IsNullOrWhiteSpace(v))
                .Select(tag => tag.ToLower())
                .ToList();

            return source
                .AsEnumerable()
                .Where(post =>
                    tagsToMatch.All(filterTag =>
                        post.Tags != null &&
                        post.Tags.Any(postTag =>
                            postTag != null && postTag.ToLower() == filterTag
                        )
                    )
                )
                .AsQueryable();
        }
    }
}