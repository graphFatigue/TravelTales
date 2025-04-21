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
            try
            {
                var jwtTokenResponse = await this.authService.LoginAsync(loginDto);
                this.logger.LogInformation("Login successful for user {Email}", loginDto.Email);
                return this.Ok(jwtTokenResponse);
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, "Error during login attempt for user {Email}", loginDto.Email);
                throw;
            }
        }

        [AllowAnonymous]
        [HttpPost("signin-google")]
        public async Task<IActionResult> SignInGoogle([FromBody] GoogleSignInDto googleSignInDto)
        {
            try
            {
                var response = await authService.LoginWithGoogleAsync(googleSignInDto.Token);
                logger.LogInformation("Google sign-in successful for user {Email}", response.User?.Email);
                return Ok(response);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error during Google sign-in");
                throw;
            }
        }

        [AllowAnonymous]
        [HttpPost("signup")]
        public async Task<IActionResult> Signup(SignupDto signupDto)
        {
            this.logger.LogInformation("Sign-up attempt for user {Email}", signupDto.Email);
            try
            {
                await this.authService.SignupAsync(signupDto);
                this.logger.LogInformation("Sign-up successful for user {Email}", signupDto.Email);
                return this.NoContent();
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, "Error during sign-up attempt for user {Email}", signupDto.Email);
                throw;
            }
        }

        [Authorize]
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] PasswordChangeDto passwordChangeDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            try
            {
                await authService.ChangePasswordAsync(userId, passwordChangeDto);
                logger.LogInformation("Password changed successfully for user {UserId}", userId);
                return NoContent();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error changing password for user {UserId}", userId);
                throw;
            }
        }

        [AllowAnonymous]
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromQuery] string email)
        {
            try
            {
                var token = await authService.GeneratePasswordResetTokenAsync(email);
                logger.LogInformation("Password reset token generated for {Email}", email);

                // In real implementation: Send email with token
                return Ok(new { Token = token });
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error generating password reset token for {Email}", email);
                throw;
            }
        }

        [AllowAnonymous]
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] PasswordResetDto passwordResetDto)
        {
            try
            {
                await authService.ResetPasswordAsync(passwordResetDto);
                logger.LogInformation("Password reset successful for {Email}", passwordResetDto.Email);
                return NoContent();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error resetting password for {Email}", passwordResetDto.Email);
                throw;
            }
        }
    }
}
