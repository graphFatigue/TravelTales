using AutoMapper;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Identity;
using TravelTales.Application.DTOs.Auth;
using TravelTales.Application.DTOs.User;
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

        public async Task<AuthResponseDto> LoginWithGoogleAsync(string token)
        {
            var payload = await GoogleJsonWebSignature.ValidateAsync(token);

            if (!payload.EmailVerified)
                throw new InvalidCredentialsAuthException("Email not verified by Google.");

            var user = await userManager.FindByEmailAsync(payload.Email);

            if (user == null)
            {
                user = new User
                {
                    UserName = payload.Email,
                    Email = payload.Email,
                    //FirstName = payload.GivenName,
                    //LastName = payload.FamilyName,
                    //BirthDate = null // Adjust based on your User model
                };

                var createResult = await userManager.CreateAsync(user);
                if (!createResult.Succeeded)
                    throw new UserCreationException(createResult.Errors.First().Description);

                var externalLogin = new UserLoginInfo("Google", payload.Subject, "Google");
                var addLoginResult = await userManager.AddLoginAsync(user, externalLogin);
                if (!addLoginResult.Succeeded)
                    throw new UserCreationException("Failed to add Google login.");

                await userManager.AddToRoleAsync(user, "User");
            }
            else
            {
                var logins = await userManager.GetLoginsAsync(user);
                if (!logins.Any(l => l.LoginProvider == "Google"))
                {
                    var externalLogin = new UserLoginInfo("Google", payload.Subject, "Google");
                    var addLoginResult = await userManager.AddLoginAsync(user, externalLogin);
                    if (!addLoginResult.Succeeded)
                        throw new UserCreationException("Failed to link Google login.");
                }
            }

            var accessToken = await jwtService.GenerateTokenAsync(user);
            var userDto = mapper.Map<UserDto>(user);

            return new AuthResponseDto
            {
                AccessToken = accessToken,
                User = userDto
            };
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

            var userDto = this.mapper.Map<UserDto>(user);

            return new AuthResponseDto
            {
                AccessToken = jwtAccessToken,
                User = userDto,
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
