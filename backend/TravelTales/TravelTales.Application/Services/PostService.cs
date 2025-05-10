using AutoMapper;
using FluentValidation;
using Sieve.Models;
using TravelTales.Application.DTOs.Post;
using TravelTales.Application.Exceptions;
using TravelTales.Application.Interfaces;
using TravelTales.Domain.Entities;
using TravelTales.Persistence;
using TravelTales.Persistence.Interfaces;
using TravelTales.Persistence.SharedFiles;

namespace TravelTales.Application.Services
{
    public class PostService : IPostService
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly IMapper mapper;
        private readonly IBloggerService bloggerService;
        private readonly IValidator<CreatePostDto> createPostDtoValidator;
        private readonly IValidator<UpdatePostDto> updatePostDtoValidator;
        private readonly IContextAccessor contextAccessor;
        private readonly IAttachmentService attachmentService;

        public PostService(
            IUnitOfWork unitOfWork,
            IMapper mapper,
            IBloggerService bloggerService,
            IValidator<CreatePostDto> createPostDtoValidator,
            IValidator<UpdatePostDto> updatePostDtoValidator,
            IContextAccessor contextAccessor,
            IAttachmentService attachmentService)
        {
            this.unitOfWork = unitOfWork;
            this.mapper = mapper;
            this.bloggerService = bloggerService;
            this.createPostDtoValidator = createPostDtoValidator;
            this.updatePostDtoValidator = updatePostDtoValidator;
            this.contextAccessor = contextAccessor;
            this.attachmentService = attachmentService;
        }

        public async Task<PostDto> CreatePostAsync(CreatePostDto createPostDto, CancellationToken cancellationToken = default)
        {
            await this.createPostDtoValidator.ValidateAndThrowAsync(createPostDto, cancellationToken: cancellationToken);

            var post = this.mapper.Map<Post>(createPostDto);

            // Clear existing categories and add new ones
            post.Categories.Clear();
            if (createPostDto.CategoryIds?.Count > 0)
            {
                var categories = await this.unitOfWork.GetRepository<ICategoryRepository>()
                    .GetAllAsync(c => createPostDto.CategoryIds.Contains(c.Id), cancellationToken);

                if (categories.Count != createPostDto.CategoryIds.Count)
                {
                    throw new ValidationException("One or more category IDs are invalid");
                }

                foreach (var category in categories)
                {
                    post.Categories.Add(category);
                }
            }

            if (createPostDto.CountryId.HasValue)
            {
                var country = await this.unitOfWork.GetRepository<ICountryRepository>()
                    .GetByIdAsync(createPostDto.CountryId.Value, cancellationToken);

                if (country == null)
                    throw new ValidationException("Invalid country ID");

                post.CountryId = createPostDto.CountryId;
            }

            if (createPostDto.CityId.HasValue && post.CountryId.HasValue)
            {
                var city = await this.unitOfWork.GetRepository<ICityRepository>()
                    .GetByIdAsync(createPostDto.CityId.Value, cancellationToken);

                if (city == null)
                    throw new ValidationException("Invalid city ID");

                post.CityId = createPostDto.CityId;
            }

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

            post = await this.unitOfWork.GetRepository<IPostRepository>()
                .GetByIdFullAsync(post.Id, cancellationToken);

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

            await this.EnsureUserCanModifyPostAsync(post);

            this.unitOfWork.GetRepository<IPostRepository>().Delete(post);
            await this.unitOfWork.SaveChangesAsync(cancellationToken);
        }

        //public async Task<PostDto?> GetPostByIdAsync(long id, CancellationToken cancellationToken = default)
        //{
        //    var post = await this.unitOfWork
        //        .GetRepository<IPostRepository>()
        //        .GetByIdFullAsync(id, cancellationToken);
        //    if (post is null)
        //    {
        //        throw new NotFoundException($"Post with ID {id} was not found.");
        //    }

        //    return this.mapper.Map<PostDto>(post);
        //}

        public async Task<PostDto?> GetPostByIdAsync(long id, CancellationToken cancellationToken = default)
        {
            var post = await this.unitOfWork
                .GetRepository<IPostRepository>()
                .GetByIdFullAsync(id, cancellationToken);
            if (post is null || post.IsDeleted)
            {
                throw new NotFoundException($"Post with ID {id} was not found.");
            }

            var currentBloggerId = await this.bloggerService.GetCurrentBloggerId(cancellationToken);
            if (currentBloggerId != -1)
            {
                var isBlocked = await this.unitOfWork.GetRepository<IBloggerBlockRepository>()
                    .ExistsAsync(post.BloggerId, currentBloggerId, cancellationToken);
                if (isBlocked)
                {
                    throw new NotFoundException($"Post with ID {id} was not found.");
                }
            }

            return this.mapper.Map<PostDto>(post);
        }

        //public async Task<IEnumerable<PostDto>> GetPostsAsync(CancellationToken cancellationToken = default)
        //{
        //    var posts = await this.unitOfWork.GetRepository<IPostRepository>()
        //        .GetAllAsync(cancellationToken);
        //    return this.mapper.Map<IEnumerable<PostDto>>(posts);
        //}

        public async Task<IEnumerable<PostDto>> GetPostsAsync(CancellationToken cancellationToken = default)
        {
            var currentBloggerId = await this.bloggerService.GetCurrentBloggerId(cancellationToken);

            var blockerIds = (await this.unitOfWork.GetRepository<IBloggerBlockRepository>()
                .GetBlockerIdsAsync(currentBloggerId, cancellationToken))
                .ToList();

            var posts = await this.unitOfWork.GetRepository<IPostRepository>()
                .GetAllAsync(cancellationToken);

            var filteredPosts = posts
                .Where(p => !p.IsDeleted && p.BloggerId!=null && !blockerIds.Contains(Convert.ToInt64(p.BloggerId)))
                .ToList();

            return this.mapper.Map<IEnumerable<PostDto>>(filteredPosts);
        }

        //public async Task<PagedList<PostDto>> GetPostsWithFilterAsync(SieveModel sieveModel, CancellationToken cancellationToken = default)
        //{
        //    var pagedList = await this.unitOfWork.GetRepository<IPostRepository>()
        //        .GetAllWithFilterAsync(sieveModel, cancellationToken);

        //    var filteredPosts = this.mapper.Map<IEnumerable<PostDto>>(pagedList.Items);

        //    var updatedPagedList = PagedList<PostDto>.Copy(pagedList, filteredPosts);

        //    return updatedPagedList;
        //}

        public async Task<PagedList<PostDto>> GetPostsWithFilterAsync(SieveModel sieveModel, CancellationToken cancellationToken = default)
        {
            var currentBloggerId = await this.bloggerService.GetCurrentBloggerId(cancellationToken);
            var blockerIds = (await this.unitOfWork.GetRepository<IBloggerBlockRepository>()
            .GetBlockerIdsAsync(currentBloggerId, cancellationToken))
            .ToList();

            var sieveModelClone = this.CloneSieveModel(sieveModel);

            if (blockerIds.Any())
            {
                sieveModelClone.Filters.Concat($",BloggerId!={string.Join(",", blockerIds)}");
            }

            var pagedList = await this.unitOfWork.GetRepository<IPostRepository>()
                .GetAllWithFilterAsync(sieveModelClone, cancellationToken);

            var filteredPosts = this.mapper.Map<IEnumerable<PostDto>>(pagedList.Items)
                .Where(p => !blockerIds.Contains(p.BloggerId))
                .ToList();

            return PagedList<PostDto>.Copy(pagedList, filteredPosts);
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

            await this.EnsureUserCanModifyPostAsync(post);
            ArgumentNullException.ThrowIfNull(updatePostDto);

            post.Title = updatePostDto.Title;
            post.Content = updatePostDto.Content;
            post.Budget = updatePostDto.Budget;

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

            if (updatePostDto.CountryId.HasValue)
            {
                var country = await this.unitOfWork.GetRepository<ICountryRepository>()
                    .GetByIdAsync(updatePostDto.CountryId.Value, cancellationToken);

                if (country == null)
                    throw new ValidationException("Invalid country ID");

                post.CountryId = updatePostDto.CountryId;
            }

            if (updatePostDto.CityId.HasValue && post.CountryId.HasValue)
            {
                var city = await this.unitOfWork.GetRepository<ICityRepository>()
                    .GetByIdAsync(updatePostDto.CityId.Value, cancellationToken);

                if (city == null)
                    throw new ValidationException("Invalid city ID");

                post.CityId = updatePostDto.CityId;
            }

            var existingCategoryIds = post.Categories.Select(c => c.Id).ToList();
            var categoriesToAdd = updatePostDto.CategoryIds.Except(existingCategoryIds);
            var categoriesToRemove = existingCategoryIds.Except(updatePostDto.CategoryIds);

            // Remove old categories
            foreach (var categoryId in categoriesToRemove)
            {
                var category = post.Categories.First(c => c.Id == categoryId);
                post.Categories.Remove(category);
            }

            // Add new categories
            var newCategories = await this.unitOfWork.GetRepository<ICategoryRepository>()
                .GetAllAsync(c => categoriesToAdd.Contains(c.Id), cancellationToken);

            foreach (var category in newCategories)
            {
                post.Categories.Add(category);
            }

            this.unitOfWork.GetRepository<IPostRepository>().Update(post);
            await this.unitOfWork.SaveChangesAsync(cancellationToken);
        }


        private async Task EnsureUserCanModifyPostAsync(Post post)
        {
            var bloggerId = await this.bloggerService.GetCurrentBloggerId();
            var userRoles = this.contextAccessor.GetCurrentUserRoles();

            if (post.BloggerId != bloggerId && !userRoles.Contains("Admin"))
            {
                throw new PermissionsException();
            }
        }

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
    }
}
