using FluentValidation;
using TravelTales.Application.DTOs.Comment;

namespace TravelTales.Application.Validation.Comment
{
    public class CreateCommentDtoValidator : AbstractValidator<CreateCommentDto>
    {
        public CreateCommentDtoValidator()
        {
            RuleFor(x => x.Content)
                .NotEmpty().WithMessage("Comment content is required")
                .MaximumLength(1000).WithMessage("Comment cannot exceed 1000 characters");

            RuleFor(x => x.PostId)
                .NotEmpty().WithMessage("Post ID is required");
        }
    }
}
