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
                    NameUa = "Мандрівник",
                    Description = "Profiles and stories of individual travelers",
                    DescriptionUa = "Профілі та історії окремих мандрівників",
                    CreatedAt = DateTime.UtcNow
                },
                new Category
                {
                    Name = "Blog",
                    NameUa = "Блог",
                    Description = "General travel blogs and guides",
                    DescriptionUa = "Загальні туристичні блоги та путівники",
                    CreatedAt = DateTime.UtcNow
                },
                new Category
                {
                    Name = "Travel Story",
                    NameUa = "Історія подорожі",
                    Description = "Personal travel narratives and experiences",
                    DescriptionUa = "Особисті розповіді та досвід подорожей",
                    CreatedAt = DateTime.UtcNow
                },
                new Category
                {
                    Name = "Tips",
                    NameUa = "Поради",
                    Description = "Advice and practical tips for travelers",
                    DescriptionUa = "Поради та практичні рекомендації для мандрівників",
                    CreatedAt = DateTime.UtcNow
                },
                new Category
                {
                    Name = "Communication",
                    NameUa = "Спілкування",
                    Description = "Forums and discussion around travel",
                    DescriptionUa = "Форуми та обговорення, пов’язані з подорожами",
                    CreatedAt = DateTime.UtcNow
                },
                new Category
                {
                    Name = "Tips Exchange",
                    NameUa = "Обмін порадами",
                    Description = "Peer-to-peer sharing of travel tips",
                    DescriptionUa = "Обмін порадами між мандрівниками",
                    CreatedAt = DateTime.UtcNow
                },
                new Category
                {
                    Name = "Social Network",
                    NameUa = "Соціальна мережа",
                    Description = "Connecting travelers in a digital community",
                    DescriptionUa = "Об'єднання мандрівників у цифрову спільноту",
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
