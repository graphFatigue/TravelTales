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
        private readonly IContextAccessor contextAccessor;

        public CommentsHub(ICommentService commentService, IContextAccessor contextAccessor)
        {
            this.commentService = commentService;
            this.contextAccessor = contextAccessor;
        }

        //public async Task SendComment(CreateCommentDto commentDto)
        //{
        //    var bloggerId = this.contextAccessor.GetCurrentBloggerId();
        //    var createdComment = await commentService.CreateCommentAsync(commentDto, bloggerId);
        //    await Clients.Group(commentDto.PostId.ToString()).SendAsync("ReceiveComment", createdComment);
        //}

        //public async Task EditComment(long commentId, UpdateCommentDto commentDto)
        //{
        //    var bloggerId = this.contextAccessor.GetCurrentBloggerId();
        //    await commentService.UpdateCommentAsync(commentId, commentDto, bloggerId);
        //    var updatedComment = await commentService.GetCommentsByPostIdAsync(commentDto.PostId);
        //    await Clients.Group(commentDto.PostId.ToString()).SendAsync("UpdateComments", updatedComment);
        //}

        //public async Task DeleteComment(long commentId, long postId)
        //{
        //    var bloggerId = this.contextAccessor.GetCurrentBloggerId();
        //    await commentService.DeleteCommentAsync(commentId, bloggerId);
        //    var updatedComments = await commentService.GetCommentsByPostIdAsync(postId);
        //    await Clients.Group(postId.ToString()).SendAsync("UpdateComments", updatedComments);
        //}

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