using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TravelTales.Application.DTOs.Auth;
using TravelTales.Application.Interfaces;

namespace TravelTales.API.Controllers
{
    [Authorize]
    [ApiController, Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService authService;
        private readonly ILogger<AuthController> logger;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
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
    }
}
