using AutoMapper;
using FluentValidation;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TravelTales.Application.DTOs.Auth;
using TravelTales.Application.DTOs.User;
using TravelTales.Application.Exceptions;
using TravelTales.Application.Interfaces;
using TravelTales.Domain.Entities;
using TravelTales.Persistence.Interfaces;

namespace TravelTales.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<User> userManager;
        private readonly SignInManager<User> signInManager;
        private readonly IJwtService jwtService;
        private readonly IMapper mapper;
        private readonly IUnitOfWork unitOfWork;
        private readonly IValidator<SignupDto> signupDtoValidator;

        public AuthService(
            UserManager<User> userManager,
            SignInManager<User> signInManager,
            IJwtService jwtService,
            IMapper mapper,
            IUnitOfWork unitOfWork,
            IValidator<SignupDto> signupDtoValidator)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.jwtService = jwtService;
            this.mapper = mapper;
            this.unitOfWork = unitOfWork;
            this.signupDtoValidator = signupDtoValidator;
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto loginDto)
        {
            ValidateLoginDto(loginDto);
            return await this.PerformLoginAsync(loginDto);
        }

        public async Task<AuthResponseDto> SignupAsync(SignupDto signupDto)
        {
            ValidateSignupDto(signupDto);
            var user = await this.PerformSignupAsync(signupDto);

            // Generate token for the new user
            var jwtAccessToken = await this.GenerateTokenAsync(user);
            var userDto = this.mapper.Map<UserDto>(user);

            return new AuthResponseDto
            {
                AccessToken = jwtAccessToken,
                User = userDto
            };
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
                    CreatedAt = DateTime.UtcNow
                };

                var createResult = await userManager.CreateAsync(user);
                if (!createResult.Succeeded)
                    throw new UserCreationException(createResult.Errors.First().Description);

                // Create Blogger profile
                var blogger = new Blogger
                {
                    UserId = user.Id,
                    FirstName = payload.GivenName,
                    LastName = payload.FamilyName,
                    CreatedAt = DateTime.UtcNow
                };

                await unitOfWork.GetRepository<IBloggerRepository>().AddAsync(blogger);
                await unitOfWork.SaveChangesAsync();

                // Add Google login
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

        public async Task ChangePasswordAsync(string userId, PasswordChangeDto passwordChangeDto)
        {
            var user = await userManager.FindByIdAsync(userId);
            if (user == null)
            {
                throw new NotFoundException("User not found");
            }

            var result = await userManager.ChangePasswordAsync(
                user,
                passwordChangeDto.CurrentPassword,
                passwordChangeDto.NewPassword
            );

            if (!result.Succeeded)
            {
                throw new IdentityException("Password change failed", result.Errors);
            }
        }

        public async Task<string> GeneratePasswordResetTokenAsync(string email)
        {
            var user = await userManager.FindByEmailAsync(email);
            if (user == null)
            {
                throw new NotFoundException("User not found");
            }

            return await userManager.GeneratePasswordResetTokenAsync(user);
        }

        public async Task ResetPasswordAsync(PasswordResetDto passwordResetDto)
        {
            var user = await userManager.FindByEmailAsync(passwordResetDto.Email);
            if (user == null)
            {
                throw new NotFoundException("User not found");
            }

            var result = await userManager.ResetPasswordAsync(
                user,
                passwordResetDto.Token,
                passwordResetDto.NewPassword
            );

            if (!result.Succeeded)
            {
                throw new IdentityException("Password reset failed", result.Errors);
            }
        }

        private void ValidateSignupDto(SignupDto signupDto)
        {
            ArgumentNullException.ThrowIfNull(signupDto);
            this.signupDtoValidator.Validate(signupDto);
        }

        private static void ValidateLoginDto(LoginDto loginDto)
        {
            ArgumentNullException.ThrowIfNull(loginDto);
        }

        private async Task<AuthResponseDto> PerformLoginAsync(LoginDto loginDto)
        {
            var user = await userManager.Users
                .Include(u => u.Blogger)
                .FirstOrDefaultAsync(u => u.Email == loginDto.Email);
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

        private async Task<User> PerformSignupAsync(SignupDto signupDto)
        {
            var user = this.mapper.Map<User>(signupDto);
            await this.CreateUserAsync(user, signupDto);
            return await this.userManager.Users
                .Include(u => u.Blogger)
                .FirstOrDefaultAsync(u => u.Id == user.Id);
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

        private async Task CreateUserAsync(User user, SignupDto signupDto)
        {
            var result = await this.userManager.CreateAsync(user, signupDto.Password);

            if (!result.Succeeded)
            {
                throw new UserCreationException($"User creation failed: {result.Errors.First().Description}");
            }

            if (result.Succeeded)
            {
                await this.userManager.AddToRoleAsync(user, "User");

                var blogger = new Blogger
                {
                    UserId = user.Id,
                    CreatedAt = DateTime.UtcNow,
                    FirstName = signupDto.FirstName,
                    LastName = signupDto.LastName,
                    BirthDate = signupDto.BirthDate,
                };

                await this.unitOfWork.GetRepository<IBloggerRepository>().AddAsync(blogger);
                await this.unitOfWork.SaveChangesAsync();
            }
        }
    }
}
