using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Sieve.Models;
using TravelTales.Application.DTOs.User;
using TravelTales.Application.Exceptions;
using TravelTales.Application.Interfaces;
using TravelTales.Domain.Entities;
using TravelTales.Persistence.Interfaces;
using TravelTales.Persistence.Repositories;
using TravelTales.Persistence.SharedFiles;

namespace TravelTales.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly IMapper mapper;
        private readonly UserManager<User> userManager;

        public UserService(
            IUnitOfWork unitOfWork,
            IMapper mapper,
            UserManager<User> userManager)
        {
            this.unitOfWork = unitOfWork;
            this.mapper = mapper;
            this.userManager = userManager;
        }

        public async Task<IEnumerable<UserDto>> GetAllUsersAsync(CancellationToken cancellationToken = default)
        {
            var users = await this.unitOfWork.GetRepository<IUserRepository>().GetAllFullAsync(cancellationToken);
            var userDtos = this.mapper.Map<IEnumerable<UserDto>>(users).ToList();

            await AddRolesToUserDtosAsync(userDtos, users);

            return userDtos;
        }

        public async Task<UserDto> GetUserByIdAsync(Guid id, CancellationToken cancellationToken = default)
        {
            var user = await this.unitOfWork.GetRepository<IUserRepository>().GetByIdFullAsync(id, cancellationToken);
            if (user is null)
            {
                throw new NotFoundException($"User with ID {id} was not found.");
            }

            return this.mapper.Map<UserDto>(user);
        }

        public async Task UpdateAsync(
           Guid id,
           UpdateUserDto updateUserDto,
           CancellationToken cancellationToken = default)
        {
            var user = await this.unitOfWork
                           .GetRepository<IUserRepository>()
                           .GetByIdAsync(id, cancellationToken)
                       ?? throw new NotFoundException($"User with ID {id} was not found.");

            ArgumentNullException.ThrowIfNull(updateUserDto);

            this.unitOfWork
                .GetRepository<IUserRepository>()
                .Update(user);

            await this.unitOfWork.SaveChangesAsync(cancellationToken);
        }

        public async Task AssignRoleToUserAsync(AssignRoleDto assignRoleDto, CancellationToken cancellationToken = default)
        {
            ValidateAssignRoleDto(assignRoleDto);
            await this.PerformRoleAssignmentAsync(assignRoleDto, cancellationToken);
        }

        public async Task<PagedList<UserDto>> GetUsersWithFilterAsync(
            SieveModel sieveModel,
            CancellationToken cancellationToken = default)
        {
            var pagedList = await this.unitOfWork.GetRepository<IUserRepository>()
                .GetAllWithFilterAsync(sieveModel, cancellationToken);

            var filteredUsers = this.mapper.Map<IEnumerable<UserDto>>(pagedList.Items)
                .Where(u => !u.IsDeleted)
                .ToList();

            await AddRolesToUserDtosAsync(filteredUsers, pagedList.Items);

            return PagedList<UserDto>.Copy(pagedList, filteredUsers);
        }

        public async Task DeleteUserAsync(Guid id, CancellationToken cancellationToken = default)
        {
            // 1. Load user with its Blogger navigation
            var user = await this.unitOfWork
                .GetRepository<IUserRepository>()
                .GetByIdFullAsync(id, cancellationToken);

            if (user is null)
            {
                throw new NotFoundException($"User with ID {id} was not found.");
            }

            var blogger = user.Blogger;
            if (blogger != null)
            {
                // 2. Delete all posts by this blogger, including their children (notifications, comments, likes, attachments, categories)
                var postRepo = this.unitOfWork.GetRepository<IPostRepository>();
                var commentRepo = this.unitOfWork.GetRepository<ICommentRepository>();
                var likeRepo = this.unitOfWork.GetRepository<ILikeRepository>();
                var notificationRepo = this.unitOfWork.GetRepository<INotificationRepository>();
                var attachmentRepo = this.unitOfWork.GetRepository<IAttachmentRepository>();

                var posts = await postRepo.GetAllAsync(p => p.BloggerId == blogger.Id, cancellationToken);

                foreach (var post in posts)
                {
                    // 2a. Delete notifications for this post
                    var notificationsForPost = await notificationRepo.GetAllAsync(n => n.PostId == post.Id, cancellationToken);
                    foreach (var notification in notificationsForPost)
                    {
                        notificationRepo.Delete(notification);
                    }

                    // 2b. Delete all comments on this post (and their notifications)
                    var comments = await commentRepo.GetAllAsync(c => c.PostId == post.Id, cancellationToken);
                    foreach (var comment in comments)
                    {
                        // delete notifications for this comment
                        var notificationsForComment = await notificationRepo.GetAllAsync(n => n.CommentId == comment.Id, cancellationToken);
                        foreach (var notification in notificationsForComment)
                        {
                            notificationRepo.Delete(notification);
                        }

                        commentRepo.Delete(comment);
                    }

                    // 2c. Delete all likes on this post (and their notifications)
                    var likes = await likeRepo.GetLikesByPostIdAsync(post.Id, cancellationToken);
                    foreach (var like in likes)
                    {
                        var notificationsForLike = await notificationRepo.GetAllAsync(n => n.LikeId == like.Id, cancellationToken);
                        foreach (var notification in notificationsForLike)
                        {
                            notificationRepo.Delete(notification);
                        }

                        await likeRepo.RemoveLikeAsync(like);
                    }

                    // 2d. Clear category‐join entries for this post (so the join‐table rows are removed)
                    var postWithCategories = await postRepo.GetByIdFullAsync(post.Id, cancellationToken);
                    if (postWithCategories.Categories != null && postWithCategories.Categories.Any())
                    {
                        postWithCategories.Categories.Clear();
                    }

                    // 2e. Delete all attachments for this post
                    var attachments = await attachmentRepo.GetAllAsync(a => a.PostId == post.Id, cancellationToken);
                    foreach (var attachment in attachments)
                    {
                        attachmentRepo.Delete(attachment);
                    }

                    // 2f. Finally, delete the post itself
                    postRepo.Delete(post);
                }

                // 3. Delete any notifications where the blogger was either recipient or triggerer
                //    (e.g. if someone liked/commented on their post, or if they triggered a notification somewhere else)
                var notificationsByTrigger = await notificationRepo.GetAllAsync(n => n.TriggeredByBloggerId == blogger.Id, cancellationToken);
                foreach (var notification in notificationsByTrigger)
                {
                    notificationRepo.Delete(notification);
                }

                var notificationsByRecipient = await notificationRepo.GetAllAsync(n => n.RecipientBloggerId == blogger.Id, cancellationToken);
                foreach (var notification in notificationsByRecipient)
                {
                    notificationRepo.Delete(notification);
                }

                // 4. Delete all follower/following relationships
                var followRepo = this.unitOfWork.GetRepository<IBloggerFollowRepository>();
                var followers = await followRepo.GetAllAsync(f => f.FollowingId == blogger.Id, cancellationToken);
                foreach (var follower in followers)
                {
                    followRepo.Delete(follower);
                }

                var following = await followRepo.GetAllAsync(f => f.FollowerId == blogger.Id, cancellationToken);
                foreach (var followRelation in following)
                {
                    followRepo.Delete(followRelation);
                }

                // 5. Delete all block relationships
                //var blockRepo = this.unitOfWork.GetRepository<IBloggerBlockRepository>();
                //var blocked = await blockRepo.GetAllAsync(b => b.BlockerId == blogger.Id, cancellationToken);
                //foreach (var block in blocked)
                //{
                //    blockRepo.Delete(block);
                //}

                //var blockedBy = await blockRepo.GetAllAsync(b => b.BlockedId == blogger.Id, cancellationToken);
                //foreach (var blockRelation in blockedBy)
                //{
                //    blockRepo.Delete(blockRelation);
                //}

                // 6. Clear “visited cities” and “visited countries” (many‐to‐many join tables)
                //    EF Core will remove join‐table entries automatically when you clear these collections.
                blogger.VisitedCities.Clear();
                blogger.VisitedCountries.Clear();

                // 7. Delete the blogger record itself
                this.unitOfWork.GetRepository<IBloggerRepository>().Delete(blogger);
            }

            // 8. Delete the user record
            this.unitOfWork.GetRepository<IUserRepository>().Delete(user);

            // 9. Save everything in one transaction
            await this.unitOfWork.SaveChangesAsync(cancellationToken);
        }

        // Add helper method to clone SieveModel
        private SieveModel CloneSieveModel(SieveModel original)
        {
            return new SieveModel
            {
                Filters = original.Filters,
                Sorts = original.Sorts,
                Page = original.Page,
                PageSize = original.PageSize
            };
        }

        private async Task AddRolesToUserDtosAsync(IEnumerable<UserDto> userDtos, IEnumerable<User> users)
        {
            foreach (var userDto in userDtos)
            {
                var user = users.First(u => u.Id == userDto.Id);
                var roles = await this.userManager.GetRolesAsync(user);
                userDto.RoleName = roles.FirstOrDefault(); // assuming one role per user
            }
        }

        private static void ValidateAssignRoleDto(AssignRoleDto assignRoleDto)
        {
            ArgumentNullException.ThrowIfNull(assignRoleDto);
        }

        private async Task PerformRoleAssignmentAsync(AssignRoleDto assignRoleDto, CancellationToken cancellationToken)
        {
            var user = await this.unitOfWork
                .GetRepository<IUserRepository>()
                .GetByIdAsync(assignRoleDto.UserId, cancellationToken)
                ?? throw new NotFoundException($"User with ID {assignRoleDto.UserId} was not found.");

            var role = await this.unitOfWork.GetRepository<IRoleRepository>().GetByIdAsync(assignRoleDto.RoleId, cancellationToken)
                ?? throw new NotFoundException($"Role with ID {assignRoleDto.RoleId} was not found.");

            var roles = await this.userManager.GetRolesAsync(user);
            if (roles.Contains(role.Name!))
            {
                throw new BusinessException($"User already has the role '{role.Name}'.");
            }

            var result = await this.userManager.AddToRoleAsync(user, role.Name!);
            if (!result.Succeeded)
            {
                throw new BusinessException($"Failed to assign role '{role.Name}' to the user.");
            }
        }
    }
}
