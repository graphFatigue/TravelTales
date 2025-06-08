using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
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
            var user = await unitOfWork
                .GetRepository<IUserRepository>()
                .GetByIdFullAsync(id, cancellationToken);

            if (user is null) throw new NotFoundException($"User with ID {id} was not found.");

            var blogger = user.Blogger;
            if (blogger != null)
            {
                // 1. Delete notifications related to blogger
                var notificationRepo = unitOfWork.GetRepository<INotificationRepository>();
                var notifications = await notificationRepo.GetAllAsync(n =>
                    n.TriggeredByBloggerId == blogger.Id ||
                    n.RecipientBloggerId == blogger.Id,
                    cancellationToken);

                foreach (var notification in notifications)
                {
                    notificationRepo.Delete(notification);
                }

                // 2. Delete all likes by blogger
                var likeRepo = unitOfWork.GetRepository<ILikeRepository>();
                //var bloggerLikes = await likeRepo.GetAllAsync(l => l.BloggerId == blogger.Id, cancellationToken);
                //foreach (var like in bloggerLikes)
                //{
                //    await likeRepo.RemoveLikeAsync(like);
                //}

                // 3. Process each post
                var postRepo = unitOfWork.GetRepository<IPostRepository>();
                var posts = await postRepo.GetAllAsync(p => p.BloggerId == blogger.Id, cancellationToken);

                foreach (var post in posts)
                {
                    // 3a. Delete notifications for this post
                    var postNotifications = await notificationRepo.GetAllAsync(n => n.PostId == post.Id, cancellationToken);
                    foreach (var notification in postNotifications)
                    {
                        notificationRepo.Delete(notification);
                    }

                    // 3b. Delete comments and their notifications
                    var commentRepo = unitOfWork.GetRepository<ICommentRepository>();
                    var comments = await commentRepo.GetAllAsync(c => c.PostId == post.Id, cancellationToken);
                    foreach (var comment in comments)
                    {
                        var commentNotifications = await notificationRepo.GetAllAsync(n => n.CommentId == comment.Id, cancellationToken);
                        foreach (var notification in commentNotifications)
                        {
                            notificationRepo.Delete(notification);
                        }
                        commentRepo.Delete(comment);
                    }

                    // 3c. Delete likes on this post
                    var postLikes = await likeRepo.GetLikesByPostIdAsync(post.Id, cancellationToken);
                    foreach (var like in postLikes)
                    {
                        var likeNotifications = await notificationRepo.GetAllAsync(n => n.LikeId == like.Id, cancellationToken);
                        foreach (var notification in likeNotifications)
                        {
                            notificationRepo.Delete(notification);
                        }
                        await likeRepo.RemoveLikeAsync(like);
                    }

                    // 3d. Delete attachments
                    var attachmentRepo = unitOfWork.GetRepository<IAttachmentRepository>();
                    var attachments = await attachmentRepo.GetAllAsync(a => a.PostId == post.Id, cancellationToken);
                    foreach (var attachment in attachments)
                    {
                        attachmentRepo.Delete(attachment);
                    }

                    // 3e. Clear categories
                    var postWithCategories = await postRepo.GetByIdFullAsync(post.Id, cancellationToken);
                    postWithCategories.Categories.Clear();

                    // 3f. Delete post
                    postRepo.Delete(post);
                }

                // 4. Delete follower/following relationships
                var followRepo = unitOfWork.GetRepository<IBloggerFollowRepository>();
                var follows = await followRepo.GetAllAsync(f =>
                    f.FollowerId == blogger.Id ||
                    f.FollowingId == blogger.Id,
                    cancellationToken);

                foreach (var follow in follows)
                {
                    followRepo.Delete(follow);
                }

                // 5. Clear visited cities/countries
                blogger.VisitedCities.Clear();
                blogger.VisitedCountries.Clear();

                // 6. Delete blogger
                unitOfWork.GetRepository<IBloggerRepository>().Delete(blogger);
            }

            // 7. Delete user
            unitOfWork.GetRepository<IUserRepository>().Delete(user);

            // 8. Save all changes
            await unitOfWork.SaveChangesAsync(cancellationToken);
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

            if (roles.Any())
            {
                foreach (var roleToRemove in roles) { 
                    await this.userManager.RemoveFromRoleAsync(user, roleToRemove!);
                }
            }
            
            if (!result.Succeeded)
            {
                throw new BusinessException($"Failed to assign role '{role.Name}' to the user.");
            }
        }
    }
}
