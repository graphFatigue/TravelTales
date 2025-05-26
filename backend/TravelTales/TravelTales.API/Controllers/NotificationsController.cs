using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sieve.Models;
using TravelTales.Application.Interfaces;

namespace TravelTales.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationsController : ControllerBase
    {
        private readonly INotificationService notificationService;
        private readonly ILogger<NotificationsController> logger;

        public NotificationsController(
            INotificationService notificationService,
            ILogger<NotificationsController> logger)
        {
            this.notificationService = notificationService;
            this.logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetNotifications([FromQuery] SieveModel sieveModel, CancellationToken cancellationToken)
        {
            logger.LogInformation("Getting notifications with filter");
            var result = await this.notificationService.GetNotificationsAsync(sieveModel, cancellationToken);
            return Ok(result);
        }

        [HttpPut("{id}/read")]
        public async Task<IActionResult> MarkAsRead(long id, CancellationToken cancellationToken)
        {
            logger.LogInformation($"Marking notification {id} as read");
            await this.notificationService.MarkAsReadAsync(id, cancellationToken);
            return NoContent();
        }

        [HttpPost("mark-all-read")]
        public async Task<IActionResult> MarkAllAsRead(CancellationToken cancellationToken)
        {
            logger.LogInformation("Marking all notifications as read");
            await this.notificationService.MarkAllAsReadAsync(cancellationToken);
            return NoContent();
        }
    }
}