using FluentValidation;
using TravelTales.Application.DTOs.Post;

namespace TravelTales.Application.Validation.Post
{
    public class UpdatePostDtoValidator : AbstractValidator<UpdatePostDto>
    {
        public const int MaxTitleLength = 150;
        public const int MaxContentLength = 2000;

        public UpdatePostDtoValidator()
        {
            this.RuleFor(model => model.Title)
              .NotEmpty().WithMessage("Title is required.")
              .MaximumLength(MaxTitleLength).WithMessage($"Title must not exceed {MaxTitleLength} characters.");

            this.RuleFor(model => model.Content)
              .NotEmpty().WithMessage("Content is required.")
              .MaximumLength(MaxContentLength).WithMessage($"Content must not exceed {MaxContentLength} characters.");
        }
    }
}
