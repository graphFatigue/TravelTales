using AutoMapper;
using FluentValidation;
using Sieve.Models;
using TravelTales.Application.DTOs.Post;
using TravelTales.Application.Exceptions;
using TravelTales.Application.Interfaces;
using TravelTales.Domain.Entities;
using TravelTales.Persistence.Interfaces;
using TravelTales.Persistence.SharedFiles;

namespace TravelTales.Application.Services
{
    public class PostService : IPostService
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly IMapper mapper;
        private readonly IValidator<CreatePostDto> createPostDtoValidator;
        private readonly IValidator<UpdatePostDto> updatePostDtoValidator;
        private readonly IContextAccessor contextAccessor;
        private readonly IAttachmentService attachmentService;

        public PostService(
            IUnitOfWork unitOfWork,
            IMapper mapper,
            IValidator<CreatePostDto> createPostDtoValidator,
            IValidator<UpdatePostDto> updatePostDtoValidator,
            IContextAccessor contextAccessor,
            IAttachmentService attachmentService)
        {
            this.unitOfWork = unitOfWork;
            this.mapper = mapper;
            this.createPostDtoValidator = createPostDtoValidator;
            this.updatePostDtoValidator = updatePostDtoValidator;
            this.contextAccessor = contextAccessor;
            this.attachmentService = attachmentService;
        }

        public async Task<PostDto> CreatePostAsync(CreatePostDto createPostDto, CancellationToken cancellationToken = default)
        {
            await this.createPostDtoValidator.ValidateAndThrowAsync(createPostDto, cancellationToken: cancellationToken);

            var post = this.mapper.Map<Post>(createPostDto);

            await this.unitOfWork.GetRepository<IPostRepository>().AddAsync(post, cancellationToken);
            await this.unitOfWork.SaveChangesAsync(cancellationToken);

            if (createPostDto.Attachments?.Count > 0)
            {
                foreach( var attachment in createPostDto.Attachments)
                {
                    var attachmentDto = attachment;
                    attachmentDto.PostId = post.Id; // Ensure correct post ID

                    await this.attachmentService.UploadAttachmentAsync(attachmentDto, cancellationToken);
                }
            }

            return this.mapper.Map<PostDto>(post);
        }

        public async Task DeletePostAsync(long id, CancellationToken cancellationToken = default)
        {
            var post = await this.unitOfWork
                .GetRepository<IPostRepository>()
                .GetByIdAsync(id, cancellationToken);
            if (post is null)
            {
                throw new NotFoundException($"Post with ID {id} was not found.");
            }

            this.EnsureUserCanModifyPost(post);

            this.unitOfWork.GetRepository<IPostRepository>().Delete(post);
            await this.unitOfWork.SaveChangesAsync(cancellationToken);
        }

        public async Task<PostDto?> GetPostByIdAsync(long id, CancellationToken cancellationToken = default)
        {
            var post = await this.unitOfWork
                .GetRepository<IPostRepository>()
                .GetByIdFullAsync(id, cancellationToken);
            if (post is null)
            {
                throw new NotFoundException($"Post with ID {id} was not found.");
            }

            return this.mapper.Map<PostDto>(post);
        }

        public async Task<IEnumerable<PostDto>> GetPostsAsync(CancellationToken cancellationToken = default)
        {
            var posts = await this.unitOfWork.GetRepository<IPostRepository>()
                .GetAllAsync(cancellationToken);
            return this.mapper.Map<IEnumerable<PostDto>>(posts);
        }

        public async Task<PagedList<PostDto>> GetPostsWithFilterAsync(SieveModel sieveModel, CancellationToken cancellationToken = default)
        {
            var pagedList = await this.unitOfWork.GetRepository<IPostRepository>()
                .GetAllWithFilterAsync(sieveModel, cancellationToken);

            var filteredPosts = this.mapper.Map<IEnumerable<PostDto>>(pagedList.Items);

            var updatedPagedList = PagedList<PostDto>.Copy(pagedList, filteredPosts);

            return updatedPagedList;
        }

        public async Task UpdatePostAsync(long id, UpdatePostDto updatePostDto, CancellationToken cancellationToken = default)
        {
            await this.updatePostDtoValidator.ValidateAndThrowAsync(updatePostDto, cancellationToken: cancellationToken);

            var post = await this.unitOfWork.GetRepository<IPostRepository>()
                .GetByIdAsync(id, cancellationToken);

            if (post is null)
            {
                throw new NotFoundException($"Post with ID {id} was not found.");
            }

            this.EnsureUserCanModifyPost(post);
            ArgumentNullException.ThrowIfNull(updatePostDto);

            post.Title = updatePostDto.Title;
            post.Content = updatePostDto.Content;

            if (updatePostDto.AttachmentsToDelete?.Any() == true)
            {
                foreach (var attachmentId in updatePostDto.AttachmentsToDelete)
                {
                    await this.attachmentService.DeleteAttachmentAsync(attachmentId, cancellationToken);
                }
            }

            if (updatePostDto.NewAttachments?.Any() == true)
            {
                foreach (var newAttachment in updatePostDto.NewAttachments)
                {
                    newAttachment.PostId = id;
                    await this.attachmentService.UploadAttachmentAsync(newAttachment, cancellationToken);
                }
            }

            this.unitOfWork.GetRepository<IPostRepository>().Update(post);
            await this.unitOfWork.SaveChangesAsync(cancellationToken);
        }


        private void EnsureUserCanModifyPost(Post post)
        {
            var userId = this.contextAccessor.GetCurrentUserId();
            var userRoles = this.contextAccessor.GetCurrentUserRoles();

            //if (post.UserId != userId && !userRoles.Contains("Admin") && !userRoles.Contains("Moderator"))
            //{
            //    throw new PermissionsException();
            //}
        }
    }
}
