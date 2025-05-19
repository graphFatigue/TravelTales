using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TravelTales.Application.DTOs.Auth;
using TravelTales.Application.Interfaces;

namespace TravelTales.API.Controllers
{
    [ApiController, Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService authService;
        private readonly ILogger<AuthController> logger;

        public AuthController(
                IAuthService authService,
                ILogger<AuthController> logger)
        {
            this.authService = authService;
            this.logger = logger;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto loginDto)
        {
            this.logger.LogInformation("Login attempt for user {Email}", loginDto.Email);

            var jwtTokenResponse = await this.authService.LoginAsync(loginDto);
            this.logger.LogInformation("Login successful for user {Email}", loginDto.Email);
            return this.Ok(jwtTokenResponse);
        }

        [AllowAnonymous]
        [HttpPost("signin-google")]
        public async Task<IActionResult> SignInGoogle([FromBody] GoogleSignInDto googleSignInDto)
        {
            var response = await authService.LoginWithGoogleAsync(googleSignInDto.Token);
            logger.LogInformation("Google sign-in successful for user {Email}", response.User?.Email);
            return Ok(response);
        }

        [AllowAnonymous]
        [HttpPost("signup")]
        public async Task<IActionResult> Signup([FromBody] SignupDto signupDto)
        {
            this.logger.LogInformation("Sign-up attempt for user {Email}", signupDto.Email);

            var response = await this.authService.SignupAsync(signupDto);
            this.logger.LogInformation("Sign-up successful for user {Email}", signupDto.Email);
            return this.Ok(response);
        }

        [Authorize]
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] PasswordChangeDto passwordChangeDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            await authService.ChangePasswordAsync(userId, passwordChangeDto);
            logger.LogInformation("Password changed successfully for user {UserId}", userId);
            return NoContent();
        }

        [AllowAnonymous]
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromQuery] string email)
        {
            await authService.ForgotPasswordAsync(email);
            logger.LogInformation("Password reset requested for {Email}", email);
            return Ok(new { Message = "If an account exists, a password reset email has been sent" });
        }

        [AllowAnonymous]
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] PasswordResetDto passwordResetDto)
        {
            await authService.ResetPasswordAsync(passwordResetDto);
            logger.LogInformation("Password reset successful for {Email}", passwordResetDto.Email);
            return NoContent();
        }
    }
}
