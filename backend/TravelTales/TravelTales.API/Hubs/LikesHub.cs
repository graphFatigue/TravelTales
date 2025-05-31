using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using TravelTales.Application.DTOs.PostLike;
using TravelTales.Application.Interfaces;

namespace TravelTales.API.Hubs
{
    [Authorize]
    public class LikesHub : Hub
    {
        private readonly ILikeService likeService;
        private readonly IBloggerService bloggerService;
        private readonly IHubContext<NotificationsHub> notificationsHub;

        public LikesHub(
            ILikeService likeService,
            IBloggerService bloggerService,
            IHubContext<NotificationsHub> notificationsHub)
        {
            this.likeService = likeService;
            this.bloggerService = bloggerService;
            this.notificationsHub = notificationsHub;
        }

        public async Task SetLike(CreatePostLikeDto createPostLikeDto)
        {
            try
            {
                var bloggerId = await bloggerService.GetCurrentBloggerId();
                createPostLikeDto.BloggerId = bloggerId;

                var notification = await likeService.AddLikeAsync(createPostLikeDto);
                var isLiked = await likeService.IsLikedAsync(createPostLikeDto.PostId, bloggerId);
                var numOfLikes = await likeService.CountLikesByPostIdAsync(createPostLikeDto.PostId);

                if (isLiked && notification!=null && notification.RecipientBloggerId != bloggerId)
                {
                    await notificationsHub.Clients
                        .Group(notification.RecipientBloggerId.ToString())
                        .SendAsync("ReceiveNotification", "New like received!", notification);
                }

                await Clients.All.SendAsync("ReceiveLikeUpdate", numOfLikes, isLiked, createPostLikeDto.PostId);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in SetLike: {ex.Message}");
                throw;
            }
        }
    }
}