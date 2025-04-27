using FluentValidation;
using TravelTales.Application.DTOs.BloggerBlock;

namespace TravelTales.Application.Validation.BloggerBlock
{
    public class UnblockBloggerDtoValidator : AbstractValidator<UnblockBloggerDto>
    {
        public UnblockBloggerDtoValidator()
        {
            RuleFor(x => x.BlockerId).GreaterThan(0);
            RuleFor(x => x.UnblockedId).GreaterThan(0);
        }
    }
}
