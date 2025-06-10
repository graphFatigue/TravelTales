using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TravelTales.Application.Interfaces;
using TravelTales.Application.Options;
using TravelTales.Domain.Entities;

namespace TravelTales.Application.Services
{
    public class JwtService : IJwtService
    {
        private readonly JwtOptions jwtOptions;
        private readonly UserManager<User> userManager;

        public JwtService(IOptions<JwtOptions> jwtOptions, UserManager<User> userManager)
        {
            ArgumentNullException.ThrowIfNull(jwtOptions);
            ArgumentNullException.ThrowIfNull(userManager);

            this.jwtOptions = jwtOptions.Value;
            this.userManager = userManager;
        }

        public async Task<string> GenerateTokenAsync(User userEntity)
        {
            ValidateUserEntity(userEntity);

            var claims = new List<Claim>
            {
                new (ClaimTypes.NameIdentifier, userEntity.Id.ToString()),
                new (ClaimTypes.Name, userEntity.UserName!),
                new (ClaimTypes.Email, userEntity.Email),
            };

            var roles = await this.userManager.GetRolesAsync(userEntity);
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            return this.GenerateToken(claims);
        }

        private static void ValidateUserEntity(User userEntity)
        {
            ArgumentNullException.ThrowIfNull(userEntity);
        }

        private string GenerateToken(IEnumerable<Claim> claims)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(this.jwtOptions.Secret);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(48),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = this.jwtOptions.Issuer,
                Audience = this.jwtOptions.Audience,
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
