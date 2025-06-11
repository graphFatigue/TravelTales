using Azure.Storage.Blobs;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication.OAuth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using SendGrid;
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
using TravelTales.Application.Sieve.Filters;
using TravelTales.Application.Sieve.Sorts;
using TravelTales.Application.Utility;
using TravelTales.Application.Validation.Post;
using TravelTales.Domain.Entities;
using TravelTales.Domain.Enums;
using TravelTales.Persistence;

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
            services.ConfigureAzureBlobServiceClient(configuration);
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
            var context = serviceProvider.GetRequiredService<AppDbContext>();

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

            var adminEmail = configuration["UserSettings:AdminEmail"];
            var adminPassword = configuration["UserSettings:AdminPassword"];

            var adminUser = await userManager.FindByEmailAsync(adminEmail);
            if (adminUser == null)
            {
                adminUser = new User
                {
                    UserName = adminEmail,
                    Email = adminEmail,
                    CreatedAt = DateTime.Now,
                    ModifiedAt = DateTime.Now,
                    IsDeleted = false,
                };

                var result = await userManager.CreateAsync(adminUser, adminPassword);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, "Admin");

                    var blogger = new Blogger
                    {
                        UserId = adminUser.Id,
                        FirstName = "System",
                        LastName = "Account",
                        Bio = "Automatically created admin blogger",
                        BirthDate = DateTime.UtcNow,
                        Sex = Sex.Other,
                        CreatedAt = DateTime.UtcNow
                    };

                    context.Bloggers.Add(blogger);
                    await context.SaveChangesAsync();
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
            services.AddScoped<IAttachmentService, AttachmentService>();
            services.AddScoped<ICategoryService, CategoryService>();
            services.AddScoped<IRoleService, RoleService>();
            services.AddScoped<IBloggerBlockService, BloggerBlockService>();
            services.AddScoped<INotificationService, NotificationService>();
            services.AddScoped<ILocationService, LocationService>();
            services.AddScoped<IStorageService, AzureBlobStorageService>();
            services.AddScoped<IEmailService, EmailService>();
            services.AddScoped<ICommentService, CommentService>();
            services.AddSignalR();
        }

        private static void ConfigureAutomapper(this IServiceCollection services)
        {
            services.AddAutoMapper(typeof(UserMappingProfile).Assembly);
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

        private static void ConfigureAzureBlobServiceClient(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            services.AddScoped(_ => new BlobServiceClient(configuration.GetSection("Azure:Blob:ConnectionString").Value));
            services.AddSingleton<ISendGridClient>(sp =>
                new SendGridClient(configuration["SendGrid:ApiKey"]));
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
                    var clientId = configuration["Authentication:Google:ClientId"];

                    if (clientId == null)
                    {
                        throw new ArgumentException(nameof(clientId));
                    }

                    var clientSecret = configuration["Authentication:Google:ClientSecret"];

                    if (clientSecret == null)
                    {
                        throw new ArgumentException(nameof(clientSecret));
                    }

                    options.ClientId = clientId;
                    options.ClientSecret = clientSecret;
                    options.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                    options.CallbackPath = new PathString("/api/auth/callback/google");

                    options.SaveTokens = true;
                    options.Events = new OAuthEvents
                    {
                        OnCreatingTicket = context =>
                        {
                            // Add custom claims here
                            return Task.CompletedTask;
                        }
                    };

                })
                .AddJwtBearer(options =>
                {
                    options.RequireHttpsMetadata = false; // For development only
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
                        ClockSkew = TimeSpan.Zero
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
            services.AddScoped<ISieveCustomFilterMethods, SieveCustomFilterMethods>();
            services.AddScoped<ISieveCustomSortMethods, SieveCustomSortMethods>();
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
