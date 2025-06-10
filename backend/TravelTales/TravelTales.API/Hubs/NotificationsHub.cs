using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using TravelTales.Application.Interfaces;

namespace TravelTales.API.Hubs
{
    [Authorize]
    public class NotificationsHub : Hub
    {
        private readonly IBloggerService bloggerService;

        public NotificationsHub(IBloggerService bloggerService)
        {
            this.bloggerService = bloggerService;
        }

        public async Task JoinNotificationGroup()
        {
            var bloggerId = await bloggerService.GetCurrentBloggerId();
            await Groups.AddToGroupAsync(Context.ConnectionId, bloggerId.ToString());
        }

        public async Task LeaveNotificationGroup()
        {
            var bloggerId = await bloggerService.GetCurrentBloggerId();
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, bloggerId.ToString());
        }
    }
}
