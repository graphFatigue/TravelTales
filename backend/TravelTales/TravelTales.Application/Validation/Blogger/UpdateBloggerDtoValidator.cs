using FluentValidation;
using TravelTales.Application.DTOs.Blogger;

namespace TravelTales.Application.Validation.Blogger
{
    public class UpdateBloggerDtoValidator : AbstractValidator<UpdateBloggerDto>
    {
        public const int MinFirstNameLength = 2;
        public const int MaxFirstNameLength = 30;
        public const int MinLastNameLength = 2;
        public const int MaxLastNameLength = 40;
        public const int MaxBioLength = 500;

        public static readonly DateTime MinBirthDate = new DateTime(1900, 1, 1);
        public static readonly DateTime MaxBirthDate = DateTime.UtcNow.AddYears(-13); // Ensuring the blogger is at least 13 years old

        public UpdateBloggerDtoValidator()
        {
            RuleFor(model => model.FirstName)
                .MinimumLength(MinFirstNameLength).WithMessage($"First name must be at least {MinFirstNameLength} characters long.")
                .MaximumLength(MaxFirstNameLength).WithMessage($"First name must not exceed {MaxFirstNameLength} characters.");

            RuleFor(model => model.LastName)
                .MinimumLength(MinLastNameLength).WithMessage($"Last name must be at least {MinLastNameLength} characters long.")
                .MaximumLength(MaxLastNameLength).WithMessage($"Last name must not exceed {MaxLastNameLength} characters.");

            RuleFor(model => model.BirthDate)
                .NotEmpty().WithMessage("Birth date is required.")
                .Must(date => date >= MinBirthDate && date <= MaxBirthDate)
                .WithMessage($"Birth date must be between {MinBirthDate.ToShortDateString()} and {MaxBirthDate.ToShortDateString()}.");

            RuleFor(model => model.Sex)
                .IsInEnum().WithMessage("Sex is required.");

            RuleFor(model => model.Bio)
                .MaximumLength(MaxBioLength).WithMessage($"Bio must not exceed {MaxBioLength} characters.");
        }
    }
}
