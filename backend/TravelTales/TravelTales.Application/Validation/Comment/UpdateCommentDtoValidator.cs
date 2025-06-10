using FluentValidation;
using TravelTales.Application.DTOs.Comment;

namespace TravelTales.Application.Validation.Comment
{
    public class UpdateCommentDtoValidator : AbstractValidator<UpdateCommentDto>
    {
        public UpdateCommentDtoValidator()
        {
            RuleFor(x => x.Content)
                .NotEmpty().WithMessage("Comment content is required")
                .MaximumLength(1000).WithMessage("Comment cannot exceed 1000 characters");
        }
    }
}
