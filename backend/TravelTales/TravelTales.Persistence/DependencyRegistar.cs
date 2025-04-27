using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TravelTales.Domain.Entities;
using TravelTales.Persistence.Claims;
using TravelTales.Persistence.Interfaces;
using TravelTales.Persistence.Repositories;
using WebApp.DataAccess.Seeding;

namespace TravelTales.Persistence
{
    public static class DependencyRegistar
    {
        public static void ConfigurePersistenceLayerDependencies(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            services.ConfigureDbContext(configuration);
            services.ConfigureIdentity();
            services.ConfigureRepositories();
            services.ConfigureUnitOfWork();
            services.ConfigureDataSeeding();
        }

        private static void ConfigureDbContext(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            services.AddDbContext<AppDbContext>(options =>
            {
                var connectionString = configuration.GetConnectionString("SqlConnection");
                options.UseSqlServer(connectionString);
            });
        }

        private static void ConfigureIdentity(
            this IServiceCollection services)
        {
            services
                .AddIdentityCore<User>(options =>
                {
                    options.User.RequireUniqueEmail = true;
                })
                .AddRoles<Role>()
                .AddEntityFrameworkStores<AppDbContext>()
                .AddDefaultTokenProviders()
                .AddRoleManager<RoleManager<Role>>()
                .AddSignInManager<SignInManager<User>>()
                .AddClaimsPrincipalFactory<CustomUserClaimsPrincipalFactory>();
        }

        private static void ConfigureRepositories(this IServiceCollection services)
        {
            services.AddScoped<IBloggerRepository, BloggerRepository>();
            services.AddScoped<IPostRepository, PostRepository>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IRoleRepository, RoleRepository>();
            services.AddScoped<ILikeRepository, LikeRepository>();
            services.AddScoped<ICategoryRepository, CategoryRepository>();
            services.AddScoped<IBloggerBlockRepository, BloggerBlockRepository>();
            services.AddScoped<ICommentRepository, CommentRepository>();
            services.AddScoped<INotificationRepository, NotificationRepository>();
        }

        private static void ConfigureUnitOfWork(this IServiceCollection services)
        {
            services.AddScoped<IUnitOfWork, UnitOfWork>();
        }

        private static void ConfigureDataSeeding(this IServiceCollection services)
        {
            services.AddHostedService<DataSeeder>();
        }
    }
}
