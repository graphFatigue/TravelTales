//// Add this class for custom filtering/sorting
//using Azure;
//using Sieve.Services;
//using System.Linq.Expressions;
//using TravelTales.Domain.Entities;

//namespace TravelTales.Application.Sieve.CustomFilters
//{
//    public class PostCustomFilters : ISieveCustomFilterMethods, ISieveCustomSortMethods
//    {
//        public Expression<Func<Post, bool>> ApplyFilter(
//            SieveProperty property,
//            Operator @operator,
//            string[] values)
//        {
//            return property.Name switch
//            {
//                "CategoryNames" => @operator switch
//                {
//                    Operator.Equals => p => p.Categories.Any(c => c.Name == values[0]),
//                    Operator.Contains => p => p.Categories.Any(c => c.Name.Contains(values[0])),
//                    Operator.Any => p => p.Categories.Any(c => values.Contains(c.Name)),
//                    _ => throw new NotSupportedException()
//                },
//                _ => throw new NotSupportedException()
//            };
//        }

//        public Expression<Func<Post, object>> ApplySort(SieveProperty property, bool isDescending)
//        {
//            if (property.Name == "CategoryNames")
//            {
//                return p => p.Categories.OrderBy(c => c.Name).FirstOrDefault().Name;
//            }

//            throw new NotSupportedException();
//        }
//    }
//}