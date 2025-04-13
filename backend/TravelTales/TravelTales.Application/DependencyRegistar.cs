using FluentValidation;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication.OAuth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Sieve.Models;
using Sieve.Services;
using System.Text;
using TravelTales.Application.Authorization.Handlers;
using TravelTales.Application.Authorization.Policies;
using TravelTales.Application.Interfaces;
using TravelTales.Application.MappingProfiles;
using TravelTales.Application.Options;
using TravelTales.Application.Services;
using TravelTales.Application.Sieve;
using TravelTales.Application.Utility;
using TravelTales.Application.Validation.Post;
using TravelTales.Domain.Entities;

namespace TravelTales.Application
{
    public static class DependencyRegistar
    {
        public static void ConfigureApplicationLayerDependencies(this IServiceCollection services, IConfiguration configuration)
        {
            ArgumentNullException.ThrowIfNull(configuration);

            services.ConfigureServices();
            services.ConfigureAutomapper();
            services.ConfigureJwtAuthentication(configuration);
            services.ConfigureOptions();
            services.ConfigureAuthorizationHandlers();
            services.AddContextAccessor();
            services.AddSieveServices(configuration);
            services.AddValidation();
        }

        public static async Task CreateUserRolesAsync(IServiceProvider serviceProvider, IConfiguration configuration)
        {
            CheckParameters(configuration);
            await CreateUserRolesInternalAsync(serviceProvider, configuration);
        }

        private static void CheckParameters(IConfiguration configuration)
        {
            ArgumentNullException.ThrowIfNull(configuration["UserSettings:AdminEmail"]);
            ArgumentNullException.ThrowIfNull(configuration["UserSettings:AdminPassword"]);
        }

        private static async Task CreateUserRolesInternalAsync(IServiceProvider serviceProvider, IConfiguration configuration)
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<Role>>();
            var userManager = serviceProvider.GetRequiredService<UserManager<User>>();

            var roleCheck = await roleManager.RoleExistsAsync("Admin");
            if (!roleCheck)
            {
                await roleManager.CreateAsync(new Role
                {
                    Name = "Admin",
                    CreatedAt = DateTime.Now,
                    ModifiedAt = DateTime.Now,
                    IsDeleted = false,
                });
            }

            roleCheck = await roleManager.RoleExistsAsync("User");
            if (!roleCheck)
            {
                await roleManager.CreateAsync(new Role
                {
                    Name = "User",
                    CreatedAt = DateTime.Now,
                    ModifiedAt = DateTime.Now,
                    IsDeleted = false,
                });
            }

            roleCheck = await roleManager.RoleExistsAsync("Moderator");
            if (!roleCheck)
            {
                await roleManager.CreateAsync(new Role
                {
                    Name = "Moderator",
                    CreatedAt = DateTime.Now,
                    ModifiedAt = DateTime.Now,
                    IsDeleted = false,
                });
            }

            var adminEmail = configuration["UserSettings:AdminEmail"];
            var adminPassword = configuration["UserSettings:AdminPassword"];

            var adminUser = await userManager.FindByEmailAsync(adminEmail);
            if (adminUser == null)
            {
                adminUser = new User
                {
                    UserName = adminEmail,
                    //FirstName = "Admin",
                    //LastName = "Admin",
                    Email = adminEmail,
                    CreatedAt = DateTime.Now,
                    ModifiedAt = DateTime.Now,
                    IsDeleted = false,
                };

                var result = await userManager.CreateAsync(adminUser, adminPassword);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, "Admin");
                }
                else
                {
                    foreach (var error in result.Errors)
                    {
                        Console.WriteLine($"Error creating admin user: {error.Description}");
                    }
                }
            }
        }

        private static void ConfigureServices(this IServiceCollection services)
        {
            services.AddScoped<IBloggerService, BloggerService>();
            services.AddScoped<IPostService, PostService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IJwtService, JwtService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<ILikeService, LikeService>();
            services.AddSignalR();
        }

        private static void ConfigureAutomapper(this IServiceCollection services)
        {
            services.AddAutoMapper(typeof(UserMappingProfile).Assembly);
            services.AddAutoMapper(typeof(AuthMappingProfile).Assembly);
            services.AddAutoMapper(typeof(BloggerMappingProfile).Assembly);
            services.AddAutoMapper(typeof(PostMappingProfile).Assembly);
            services.AddAutoMapper(typeof(RoleMappingProfile).Assembly);
        }

        private static void AddContextAccessor(this IServiceCollection services)
        {
            services.AddHttpContextAccessor();
            services.AddScoped<IContextAccessor, ContextAccessor>();
        }

        private static void AddValidation(this IServiceCollection services)
        {
            services.AddValidatorsFromAssemblyContaining<CreatePostDtoValidator>();
        }

        private static void ConfigureJwtAuthentication(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            var key = Environment.GetEnvironmentVariable("JWT_SECRET_KEY") ?? "JwtVerySecretKey1111111111111111111";

            services
                .AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultSignInScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddCookie()
                .AddGoogle(options =>
                {
                    var clientId = configuration["Authentication: Google:ClientId"];

                    if (clientId == null)
                    {
                        throw new ArgumentException(nameof(clientId));
                    }

                    var clientSecret = configuration["Authentication: Google:ClientSecret"];

                    if (clientSecret == null)
                    {
                        throw new ArgumentException(nameof(clientSecret));
                    }

                    options.ClientId = clientId;
                    options.ClientSecret = clientSecret;
                    options.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                    options.CallbackPath = "/api/auth/signin-google-callback";
                    options.SaveTokens = true;
                    options.Events = new OAuthEvents
                    {
                        OnCreatingTicket = context =>
                        {
                            // Add custom claims here if needed
                            return Task.CompletedTask;
                        }
                    };

                })
                .AddJwtBearer(options =>
                {
                    options.SaveToken = true;
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidIssuer = Environment.GetEnvironmentVariable("JwtIssuer") ?? "JwtIssuer",
                        ValidateAudience = true,
                        ValidAudience = Environment.GetEnvironmentVariable("JwtAudience") ?? "JwtAudience",
                        ValidateLifetime = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
                        ValidateIssuerSigningKey = true,
                    };
                    options.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            var accessToken = context.Request.Query["access_token"];
                            var path = context.Request.Path;

                            if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs"))
                            {
                                context.Token = accessToken;
                            }

                            return Task.CompletedTask;
                        },
                    };
                });
        }

        private static void AddSieveServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<SieveOptions>(configuration.GetSection("Sieve"));
            services.AddScoped<ISieveProcessor, ApplicationSieveProcessor>();
        }

        private static void ConfigureOptions(this IServiceCollection services)
        {
            services.ConfigureOptions<JwtOptionsSetup>();
        }

        private static void ConfigureAuthorizationHandlers(this IServiceCollection services)
        {
            services.AddSingleton<IAuthorizationPolicyProvider, PermissionAuthorizationPolicyProvider>();
            services.AddScoped<IAuthorizationHandler, PermissionAuthorizationHandler>();
        }
    }
}
