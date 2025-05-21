//using Microsoft.AspNetCore.SignalR;
//using TravelTales.Application.DTOs.PostLike;
//using TravelTales.Application.Interfaces;

//namespace TravelTales.API.Hubs
//{
//    public class LikesHub : Hub
//    {
//        private readonly ILikeService likeService;

//        public LikesHub(ILikeService likeService)
//        {
//            this.likeService = likeService;
//        }

//        public async Task SetLike(CreatePostLikeDto createPostLikeDto)
//        {
//            try
//            {
//                await this.likeService.AddLikeAsync(createPostLikeDto);
//                bool isLiked = await this.likeService.IsLikedAsync(createPostLikeDto.PostId, createPostLikeDto.BloggerId);
//                int numOfLikes = await this.likeService.CountLikesByPostIdAsync(createPostLikeDto.PostId);
//                await this.Clients.All.SendAsync("ReceiveMessage", numOfLikes, isLiked, createPostLikeDto.PostId, createPostLikeDto.BloggerId);
//            }
//            catch (Exception ex)
//            {
//                Console.WriteLine($"Error in SetLike: {ex.Message}");
//                throw;
//            }
//        }
//    }
//}

// Updated LikesHub.cs
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

                await this.likeService.AddLikeAsync(createPostLikeDto);
                var isLiked = await likeService.IsLikedAsync(createPostLikeDto.PostId, bloggerId);
                var numOfLikes = await likeService.CountLikesByPostIdAsync(createPostLikeDto.PostId);

                if (isLiked)
                {
                    await notificationsHub.Clients
                        .Group(createPostLikeDto.BloggerId.ToString())
                        .SendAsync("ReceiveNotification", "New like received!");
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