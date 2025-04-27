using FluentValidation;
using TravelTales.Application.DTOs.BloggerBlock;

namespace TravelTales.Application.Validation.BloggerBlock
{
    public class BlockBloggerDtoValidator : AbstractValidator<BlockBloggerDto>
    {
        public BlockBloggerDtoValidator()
        {
            RuleFor(x => x.BlockerId).GreaterThan(0);
            RuleFor(x => x.BlockedId).GreaterThan(0);
        }
    }
}
