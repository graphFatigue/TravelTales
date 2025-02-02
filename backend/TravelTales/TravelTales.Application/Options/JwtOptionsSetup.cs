using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;

namespace TravelTales.Application.Options
{
    public class JwtOptionsSetup : IConfigureOptions<JwtOptions>
    {
        private readonly IConfiguration configuration;

        public JwtOptionsSetup(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        public void Configure(JwtOptions options)
        {
            this.configuration
                .GetSection(JwtOptions.SectionName)
                .Bind(options);
        }
    }
}
