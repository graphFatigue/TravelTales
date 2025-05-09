using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;
using TravelTales.Domain.Entities;
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
        if (!await context.Countries.AnyAsync())
        {
            using var client = new HttpClient();
            var response = await client.GetAsync("https://countriesnow.space/api/v0.1/countries");

            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                var countriesData = JsonConvert.DeserializeObject<ApiCountryResponse>(content);

                foreach (var countryData in countriesData.Data)
                {
                    var country = new Country
                    {
                        Name = countryData.Country,
                        Iso2 = countryData.Iso2,
                        Iso3 = countryData.Iso3,
                        Cities = countryData.Cities.Select(c => new City { Name = c }).ToList()
                    };

                    context.Countries.Add(country);
                }
                await context.SaveChangesAsync();
            }
        }
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
    private class ApiCountryResponse
    {
        public bool Error { get; set; }
        public string Msg { get; set; }
        public List<CountryData> Data { get; set; }
    }

    private class CountryData
    {
        public string Iso2 { get; set; }
        public string Iso3 { get; set; }
        public string Country { get; set; }
        public List<string> Cities { get; set; }
    }
}
