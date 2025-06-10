using FluentValidation;
using TravelTales.Application.DTOs.Auth;

namespace TravelTales.Application.Validation.Auth
{
    public class SignupDtoValidator : AbstractValidator<SignupDto>
    {
        public const int MinFirstNameLength = 2;
        public const int MaxFirstNameLength = 30;
        public const int MinLastNameLength = 2;
        public const int MaxLastNameLength = 40;
        public const int MinPasswordLength = 6;
        public const int MaxPasswordLength = 100;

        public static readonly DateTime MinBirthDate = new DateTime(1900, 1, 1);
        public static readonly DateTime MaxBirthDate = DateTime.UtcNow.AddYears(-13);

        public SignupDtoValidator()
        {
            RuleFor(model => model.Email)
                .NotEmpty().WithMessage("Email is required.")
                .EmailAddress().WithMessage("A valid email address is required.");

            RuleFor(model => model.FirstName)
                .NotEmpty().WithMessage("First name is required.")
                .MinimumLength(MinFirstNameLength).WithMessage($"First name must be at least {MinFirstNameLength} characters long.")
                .MaximumLength(MaxFirstNameLength).WithMessage($"First name must not exceed {MaxFirstNameLength} characters.");

            RuleFor(model => model.LastName)
                .NotEmpty().WithMessage("Last name is required.")
                .MinimumLength(MinLastNameLength).WithMessage($"Last name must be at least {MinLastNameLength} characters long.")
                .MaximumLength(MaxLastNameLength).WithMessage($"Last name must not exceed {MaxLastNameLength} characters.");

            RuleFor(model => model.BirthDate)
                .NotEmpty().WithMessage("Birth date is required.")
                .Must(date => date >= MinBirthDate && date <= MaxBirthDate)
                .WithMessage($"Birth date must be between {MinBirthDate:yyyy-MM-dd} and {MaxBirthDate:yyyy-MM-dd}.");

            RuleFor(model => model.Password)
                .NotEmpty().WithMessage("Password is required.")
                .MinimumLength(MinPasswordLength).WithMessage($"Password must be at least {MinPasswordLength} characters long.")
                .MaximumLength(MaxPasswordLength).WithMessage($"Password must not exceed {MaxPasswordLength} characters.");
        }
    }
}
