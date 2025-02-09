using Microsoft.AspNetCore.SignalR;
using TravelTales.Application.DTOs.PostLike;
using TravelTales.Application.Interfaces;

namespace TravelTales.API.Hubs
{
    public class LikesHub : Hub
    {
        private readonly ILikeService likeService;

        public LikesHub(ILikeService likeService)
        {
            this.likeService = likeService;
        }

        public async Task SetLike(CreatePostLikeDto createPostLikeDto)
        {
            try
            {
                await this.likeService.AddLikeAsync(createPostLikeDto);
                bool isLiked = await this.likeService.IsLikedAsync(createPostLikeDto.PostId, createPostLikeDto.BloggerId);
                int numOfLikes = await this.likeService.CountLikesByPostIdAsync(createPostLikeDto.PostId);
                await this.Clients.All.SendAsync("ReceiveMessage", numOfLikes, isLiked, createPostLikeDto.PostId, createPostLikeDto.BloggerId);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in SetLike: {ex.Message}");
                throw;
            }
        }
    }
}
