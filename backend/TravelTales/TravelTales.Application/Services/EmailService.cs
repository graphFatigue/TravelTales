using Microsoft.Extensions.Configuration;
using SendGrid;
using SendGrid.Helpers.Mail;
using TravelTales.Application.Interfaces;

namespace TravelTales.Application.Services
{
    public class EmailService : IEmailService
    {
        private readonly ISendGridClient sendGridClient;
        private readonly string fromEmail;
        private readonly string frontendResetUrl;

        public EmailService(
            ISendGridClient sendGridClient,
            IConfiguration configuration)
        {
            this.sendGridClient = sendGridClient;
            fromEmail = configuration["SendGrid:FromEmail"];
            frontendResetUrl = configuration["Frontend:ResetPasswordUrl"];
        }

        public async Task SendPasswordResetEmailAsync(string email, string resetToken)
        {
            var resetLink = $"{frontendResetUrl}?email={Uri.EscapeDataString(email)}&token={Uri.EscapeDataString(resetToken)}";

            var msg = new SendGridMessage
            {
                From = new EmailAddress(fromEmail),
                Subject = "TravelTales - Password Reset Request",
                PlainTextContent = $"Please reset your password by clicking here: {resetLink}",
                HtmlContent = $@"<strong>Password Reset</strong>
                              <p>Click <a href='{resetLink}'>here</a> to reset your password.</p>
                              <p>This link will expire in 1 hour.</p>"
            };

            msg.AddTo(new EmailAddress(email));
            var response = await sendGridClient.SendEmailAsync(msg);

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception("Failed to send password reset email");
            }
        }
    }
}
