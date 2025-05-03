using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using TravelTales.Application.DTOs.Comment;
using TravelTales.Application.Interfaces;

namespace TravelTales.API.Hubs
{
    [Authorize]
    public class CommentsHub : Hub
    {
        private readonly ICommentService commentService;
        private readonly IBloggerService bloggerService;
        private readonly IHubContext<NotificationsHub> notificationsHub;

        public CommentsHub(ICommentService commentService, IBloggerService bloggerService, IHubContext<NotificationsHub> notificationsHub)
        {
            this.commentService = commentService;
            this.bloggerService = bloggerService;
            this.notificationsHub = notificationsHub;
        }

        //public async Task SendComment(CreateCommentDto commentDto)
        //{
        //    var bloggerId = await this.bloggerService.GetCurrentBloggerId();
        //    var createdComment = await commentService.CreateCommentAsync(commentDto, bloggerId);
        //    await Clients.Group(commentDto.PostId.ToString()).SendAsync("ReceiveComment", createdComment);
        //}

        public async Task SendComment(CreateCommentDto commentDto)
        {
            var bloggerId = await bloggerService.GetCurrentBloggerId();
            var createdComment = await commentService.CreateCommentAsync(commentDto, bloggerId);

            if (createdComment.Post?.BloggerId != null && createdComment.Post.BloggerId != bloggerId)
            {
                await this.notificationsHub.Clients
                    .Group(createdComment.Post.BloggerId.ToString())
                    .SendAsync("ReceiveNotification", "New comment received!");
            }

            await Clients.Group(commentDto.PostId.ToString())
                .SendAsync("ReceiveComment", createdComment);
        }

        public async Task EditComment(long commentId, UpdateCommentDto commentDto, long postId)
        {
            var bloggerId = await bloggerService.GetCurrentBloggerId();
            await commentService.UpdateCommentAsync(commentId, commentDto, bloggerId);

            var updatedComments = await commentService.GetCommentsByPostIdAsync(postId);
            await Clients.Group(postId.ToString()).SendAsync("UpdateComments", updatedComments);
        }

        public async Task DeleteComment(long commentId, long postId)
        {
            var bloggerId = await this.bloggerService.GetCurrentBloggerId();
            await commentService.DeleteCommentAsync(commentId, bloggerId);
            var updatedComments = await commentService.GetCommentsByPostIdAsync(postId);
            await Clients.Group(postId.ToString()).SendAsync("UpdateComments", updatedComments);
        }

        public async Task JoinPostGroup(long postId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, postId.ToString());
        }

        public async Task LeavePostGroup(long postId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, postId.ToString());
        }
    }
}