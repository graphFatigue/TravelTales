using TravelTales.Application.DTOs.Auth;

namespace TravelTales.Application.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDto> LoginAsync(LoginDto loginDto);

        Task SignupAsync(SignupDto signupDto);

        Task<AuthResponseDto> LoginWithGoogleAsync(string token);

        Task ChangePasswordAsync(string userId, PasswordChangeDto passwordChangeDto);

        Task<string> GeneratePasswordResetTokenAsync(string email);

        Task ResetPasswordAsync(PasswordResetDto passwordResetDto);
    }
}
