using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using TravelTales.Domain.Entities;
using TravelTales.Domain.Enums;
using TravelTales.Persistence;

namespace WebApp.DataAccess.Seeding;


public class DataSeeder : IHostedService
{
    private readonly IServiceProvider serviceProvider;

    public DataSeeder(IServiceProvider serviceProvider)
    {
        this.serviceProvider = serviceProvider;
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        using var scope = this.serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        await context.Database.MigrateAsync(cancellationToken);

        await SeedDataAsync(context);
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;

    private static async Task SeedDataAsync(AppDbContext context)
    {
        if (!await context.Categories.AnyAsync())
        {
            context.Categories.AddRange(
                new Category
                {
                    Name = "Traveler",
                    Description = "Profiles and stories of individual travelers",
                    CreatedAt = DateTime.UtcNow
                },
                new Category
                {
                    Name = "Blog",
                    Description = "General travel blogs and guides",
                    CreatedAt = DateTime.UtcNow
                },
                new Category
                {
                    Name = "Travel Story",
                    Description = "Personal travel narratives and experiences",
                    CreatedAt = DateTime.UtcNow
                },
                new Category
                {
                    Name = "Tips",
                    Description = "Advice and practical tips for travelers",
                    CreatedAt = DateTime.UtcNow
                },
                new Category
                {
                    Name = "Communication",
                    Description = "Forums and discussion around travel",
                    CreatedAt = DateTime.UtcNow
                },
                new Category
                {
                    Name = "Tips Exchange",
                    Description = "Peer-to-peer sharing of travel tips",
                    CreatedAt = DateTime.UtcNow
                },
                new Category
                {
                    Name = "Social Network",
                    Description = "Connecting travelers in a digital community",
                    CreatedAt = DateTime.UtcNow
                }
            );
        }

        await context.SaveChangesAsync();
    }
}
