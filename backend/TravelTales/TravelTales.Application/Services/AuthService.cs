using AutoMapper;
using Microsoft.AspNetCore.Identity;
using TravelTales.Application.DTOs.Auth;
using TravelTales.Application.Exceptions;
using TravelTales.Application.Interfaces;
using TravelTales.Domain.Entities;

namespace TravelTales.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<User> userManager;
        private readonly SignInManager<User> signInManager;
        private readonly IJwtService jwtService;
        private readonly IMapper mapper;

        public AuthService(
            UserManager<User> userManager,
            SignInManager<User> signInManager,
            IJwtService jwtService,
            IMapper mapper)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.jwtService = jwtService;
            this.mapper = mapper;
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto loginDto)
        {
            ValidateLoginDto(loginDto);
            return await this.PerformLoginAsync(loginDto);
        }

        public async Task SignupAsync(SignupDto signupDto)
        {
            ValidateSignupDto(signupDto);
            await this.PerformSignupAsync(signupDto);
        }

        private static void ValidateSignupDto(SignupDto signupDto)
        {
            ArgumentNullException.ThrowIfNull(signupDto);
        }

        private static void ValidateLoginDto(LoginDto loginDto)
        {
            ArgumentNullException.ThrowIfNull(loginDto);
        }

        private async Task<AuthResponseDto> PerformLoginAsync(LoginDto loginDto)
        {
            var user = await this.userManager.FindByEmailAsync(loginDto.Email);
            if (user is null)
            {
                throw new InvalidCredentialsAuthException();
            }

            await this.CheckPasswordSigninAsync(user, loginDto.Password);

            var jwtAccessToken = await this.GenerateTokenAsync(user);

            return new AuthResponseDto
            {
                AccessToken = jwtAccessToken,
            };
        }

        private async Task PerformSignupAsync(SignupDto signupDto)
        {
            var user = this.mapper.Map<User>(signupDto);
            await this.CreateUserAsync(user, signupDto.Password);
        }

        private async Task<string> GenerateTokenAsync(User user)
        {
            var jwtAccessToken = await this.jwtService.GenerateTokenAsync(user);
            return jwtAccessToken;
        }

        private async Task CheckPasswordSigninAsync(User user, string password)
        {
            var result = await this.signInManager.CheckPasswordSignInAsync(user, password, false);
            if (!result.Succeeded)
            {
                throw new InvalidCredentialsAuthException();
            }
        }

        private async Task CreateUserAsync(User user, string password)
        {
            var result = await this.userManager.CreateAsync(user, password);

            if (!result.Succeeded)
            {
                throw new UserCreationException($"User creation failed: {result.Errors.First().Description}");
            }

            if (result.Succeeded)
            {
                await this.userManager.AddToRoleAsync(user, "User");
            }
        }
    }
}
