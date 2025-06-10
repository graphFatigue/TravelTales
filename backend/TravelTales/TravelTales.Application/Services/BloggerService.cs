using AutoMapper;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Sieve.Models;
using System.Linq;
using TravelTales.Application.DTOs.Blogger;
using TravelTales.Application.DTOs.BloggerFollow;
using TravelTales.Application.DTOs.Comment;
using TravelTales.Application.DTOs.Post;
using TravelTales.Application.Exceptions;
using TravelTales.Application.Interfaces;
using TravelTales.Domain.Entities;
using TravelTales.Persistence;
using TravelTales.Persistence.Interfaces;
using TravelTales.Persistence.Repositories;
using TravelTales.Persistence.SharedFiles;

namespace TravelTales.Application.Services
{
    public class BloggerService : IBloggerService
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly IMapper mapper;
        private readonly IValidator<CreateBloggerDto> createBloggerDtoValidator;
        private readonly IValidator<UpdateBloggerDto> updateBloggerDtoValidator;
        private readonly IContextAccessor contextAccessor;
        private readonly IStorageService blobStorageService;
        private readonly IUserService userService;

        public BloggerService(
            IUnitOfWork unitOfWork,
            IMapper mapper,
            IValidator<CreateBloggerDto> createBloggerDtoValidator,
            IValidator<UpdateBloggerDto> updateBloggerDtoValidator,
            IContextAccessor contextAccessor,
            IStorageService blobStorageService,
            IUserService userService)
        {
            this.unitOfWork = unitOfWork;
            this.mapper = mapper;
            this.createBloggerDtoValidator = createBloggerDtoValidator;
            this.updateBloggerDtoValidator = updateBloggerDtoValidator;
            this.contextAccessor = contextAccessor;
            this.blobStorageService = blobStorageService;
            this.userService = userService;
        }

        public async Task<BloggerDto> CreateBloggerAsync(CreateBloggerDto createBloggerDto, CancellationToken cancellationToken = default)
        {
            await this.createBloggerDtoValidator.ValidateAndThrowAsync(createBloggerDto, cancellationToken: cancellationToken);
            var blogger = this.mapper.Map<Blogger>(createBloggerDto);

            await this.unitOfWork.GetRepository<BloggerRepository>().AddAsync(blogger, cancellationToken);
            await this.unitOfWork.SaveChangesAsync(cancellationToken);

            return this.mapper.Map<BloggerDto>(blogger);
        }

        public async Task DeleteBloggerAsync(long bloggerId, CancellationToken cancellationToken = default)
        {
            var bloggerRepo = unitOfWork.GetRepository<IBloggerRepository>();
            var blogger = await bloggerRepo
                .AsQueryable()
                .Include(b => b.User)
                .FirstOrDefaultAsync(b => b.Id == bloggerId && !b.IsDeleted, cancellationToken);

            if (blogger is null)
                throw new NotFoundException($"Blogger with ID {bloggerId} was not found.");

            await EnsureUserCanDeleteBloggerAsync(blogger);

            if (blogger.User is null)
                throw new NotFoundException("User associated with the blogger not found.");

            await userService.DeleteUserAsync(blogger.User.Id, cancellationToken);
        }

        public async Task<long> GetCurrentBloggerId(CancellationToken cancellationToken = default)
        {
            var userId = this.contextAccessor.GetCurrentUserId();
            var blogger = await this.unitOfWork.GetRepository<IBloggerRepository>()
                .AsQueryable()
                .FirstOrDefaultAsync(b => b.UserId == userId && !b.IsDeleted, cancellationToken);

            if (blogger == null)
            {
                throw new NotFoundException("Blogger profile not found for current user.");
            }

            return blogger.Id;
        }

        public async Task<BloggerDto?> GetBloggerByIdAsync(long id, CancellationToken cancellationToken = default)
        {
            var blogger = await this.unitOfWork.GetRepository<IBloggerRepository>()
                .GetByIdFullAsync(id, cancellationToken);

            if (blogger is null || blogger.IsDeleted)
                throw new NotFoundException($"Blogger with ID {id} was not found.");

            var currentBloggerId = await GetCurrentBloggerIdSafeAsync(cancellationToken);
            var isBlocked = currentBloggerId != -1 &&
                await this.unitOfWork.GetRepository<IBloggerBlockRepository>()
                    .ExistsAsync(blogger.Id, currentBloggerId, cancellationToken);

            var dto = this.mapper.Map<BloggerDto>(blogger);

            // Get posts separately
            var posts = await this.unitOfWork.GetRepository<IPostRepository>()
                .GetAllFullAsync(p => p.BloggerId == id, cancellationToken);

            dto.Posts = this.mapper.Map<List<PostShortInfoDto>>(posts);

            if (currentBloggerId != -1)
            {
                dto.IsFollowing = await unitOfWork.GetRepository<IBloggerFollowRepository>()
                    .ExistsAsync(currentBloggerId, id, cancellationToken);
            }

            if (isBlocked)
                MaskBloggerDetails(dto);

            return dto;
        }

        public async Task<IEnumerable<BloggerDto>> GetBloggersAsync(CancellationToken cancellationToken = default)
        {
            var bloggers = await this.unitOfWork.GetRepository<IBloggerRepository>()
                .GetAllFullAsync(cancellationToken);

            var currentBloggerId = await GetCurrentBloggerIdSafeAsync(cancellationToken);
            var blockerIds = currentBloggerId != -1
                ? await this.unitOfWork.GetRepository<IBloggerBlockRepository>()
                    .GetBlockerIdsAsync(currentBloggerId, cancellationToken)
                : new List<long>();

            return bloggers
                .Where(b => !b.IsDeleted)
                .Select(blogger =>
                {
                    var dto = this.mapper.Map<BloggerDto>(blogger);
                    if (blockerIds.Contains(blogger.Id))
                        MaskBloggerDetails(dto);
                    return dto;
                }).ToList();
        }

        public async Task<PagedList<BloggerDto>> GetBloggersWithFilterAsync(SieveModel sieveModel, CancellationToken cancellationToken = default)
        {
            var pagedList = await this.unitOfWork.GetRepository<IBloggerRepository>()
                .GetAllWithFilterAsync(sieveModel, cancellationToken);

            var currentBloggerId = await GetCurrentBloggerIdSafeAsync(cancellationToken);
            var blockerIds = currentBloggerId != -1
                ? await this.unitOfWork.GetRepository<IBloggerBlockRepository>()
                    .GetBlockerIdsAsync(currentBloggerId, cancellationToken)
                : new List<long>();

            var filteredDtos = pagedList?.Items?
                .Where(b => !b.IsDeleted)
                .Select(blogger =>
                {
                    var dto = this.mapper.Map<BloggerDto>(blogger);
                    if (blockerIds.Contains(blogger.Id))
                        MaskBloggerDetails(dto);
                    return dto;
                }).ToList();

            return PagedList<BloggerDto>.Copy(pagedList, filteredDtos);
        }

        public async Task UpdateBloggerAsync(long id, UpdateBloggerDto updateBloggerDto, CancellationToken cancellationToken = default)
        {
            await this.updateBloggerDtoValidator.ValidateAndThrowAsync(updateBloggerDto, cancellationToken: cancellationToken);

            var blogger = await this.unitOfWork.GetRepository<IBloggerRepository>()
                .GetByIdFullAsync(id, cancellationToken);

            if (blogger is null)
            {
                throw new NotFoundException($"Blogger with ID {id} was not found.");
            }

            await this.EnsureUserCanModifyBloggerAsync(blogger);

            blogger.FirstName = updateBloggerDto.FirstName;
            blogger.LastName = updateBloggerDto.LastName;
            blogger.Bio = updateBloggerDto.Bio;
            blogger.BirthDate = updateBloggerDto.BirthDate;
            blogger.Sex = (Domain.Enums.Sex)updateBloggerDto.Sex;

            if (updateBloggerDto.CountryId.HasValue)
            {
                var country = await this.unitOfWork.GetRepository<ICountryRepository>()
                    .GetByIdAsync(updateBloggerDto.CountryId.Value, cancellationToken);

                if (country == null)
                    throw new ValidationException("Invalid country ID");
                blogger.CountryId = updateBloggerDto.CountryId;
            }

            if (updateBloggerDto.CityId.HasValue && blogger.CountryId.HasValue)
            {
                var city = await this.unitOfWork.GetRepository<ICityRepository>()
                    .GetByIdAsync(updateBloggerDto.CityId.Value, cancellationToken);

                if (city == null)
                    throw new ValidationException("Invalid city ID");

                blogger.CityId = updateBloggerDto.CityId;
            }

            // Update visited cities (only remove/add diffs)
            var existingVisitedCityIds = blogger.VisitedCities.Select(c => c.Id).ToList();
            var cityIdsToAdd = updateBloggerDto.VisitedCityIds.Except(existingVisitedCityIds).ToList();
            var cityIdsToRemove = existingVisitedCityIds.Except(updateBloggerDto.VisitedCityIds).ToList();

            foreach (var cityId in cityIdsToRemove)
            {
                var city = blogger.VisitedCities.FirstOrDefault(c => c.Id == cityId);
                if (city != null)
                {
                    blogger.VisitedCities.Remove(city);
                }
            }

            if (cityIdsToAdd.Any())
            {
                var citiesToAdd = await this.unitOfWork.GetRepository<ICityRepository>()
                    .GetByIdsAsync(cityIdsToAdd, cancellationToken);

                foreach (var city in citiesToAdd)
                {
                    blogger.VisitedCities.Add(city);
                }
            }

            // Update visited countries (only remove/add diffs)
            var existingVisitedCountryIds = blogger.VisitedCountries.Select(c => c.Id).ToList();
            var countryIdsToAdd = updateBloggerDto.VisitedCountryIds.Except(existingVisitedCountryIds).ToList();
            var countryIdsToRemove = existingVisitedCountryIds.Except(updateBloggerDto.VisitedCountryIds).ToList();

            foreach (var countryId in countryIdsToRemove)
            {
                var country = blogger.VisitedCountries.FirstOrDefault(c => c.Id == countryId);
                if (country != null)
                {
                    blogger.VisitedCountries.Remove(country);
                }
            }

            if (countryIdsToAdd.Any())
            {
                var countriesToAdd = await this.unitOfWork.GetRepository<ICountryRepository>()
                    .GetAllAsync(c => countryIdsToAdd.Contains(c.Id), cancellationToken);

                foreach (var country in countriesToAdd)
                {
                    blogger.VisitedCountries.Add(country);
                }
            }

            ArgumentNullException.ThrowIfNull(updateBloggerDto);


            this.unitOfWork.GetRepository<IBloggerRepository>().Update(blogger);
            await this.unitOfWork.SaveChangesAsync(cancellationToken);
        }

        public async Task UpdateBloggerImageAsync(long id, UpdateBloggerImageDto updateBloggerImageDto, CancellationToken cancellationToken = default)
        {
            var blogger = await this.unitOfWork.GetRepository<IBloggerRepository>()
                .GetByIdFullAsync(id, cancellationToken);

            if (blogger is null)
            {
                throw new NotFoundException($"Blogger with ID {id} was not found.");
            }

            if (updateBloggerImageDto.RemoveExisting && !string.IsNullOrEmpty(blogger.Image))
            {
                var (containerName, fileName) = ExtractBlobInfo(blogger.Image);
                if (!string.IsNullOrEmpty(containerName) && !string.IsNullOrEmpty(fileName))
                {
                    await this.blobStorageService.DeleteAsync(containerName, fileName);
                }

                blogger.Image = null;
            }

            if (updateBloggerImageDto.ImageBytes != null)
            {
                var stream = new MemoryStream(updateBloggerImageDto.ImageBytes);

                string sanitizedEmail = blogger.User.Email!.Replace("@", "-"); // Replace @ with -
                string fileName = $"{sanitizedEmail}-{Guid.NewGuid()}.jpg";

                var blobUri = await this.blobStorageService.UploadAsync(stream, "user-photos", fileName);

                blogger.Image = blobUri;
            }

            this.unitOfWork.GetRepository<IBloggerRepository>().Update(blogger);
            await this.unitOfWork.SaveChangesAsync(cancellationToken);
        }

        public async Task FollowBloggerAsync(long followingId, CancellationToken cancellationToken = default)
        {
            try
            {
                var followerId = await GetCurrentBloggerId(cancellationToken);

                if (followerId == followingId)
                    throw new ValidationException("Cannot follow yourself");

                if (await unitOfWork.GetRepository<IBloggerFollowRepository>()
                    .ExistsAsync(followerId, followingId, cancellationToken))
                {
                    throw new ValidationException("Already following this blogger");
                }

                var follow = new BloggerFollow
                {
                    FollowerId = followerId,
                    FollowingId = followingId
                };

                await unitOfWork.GetRepository<IBloggerFollowRepository>().AddAsync(follow, cancellationToken);
                await unitOfWork.SaveChangesAsync(cancellationToken);
            }
            catch (NotAuthorizedException)
            {
                throw new PermissionsException("Authentication required for this operation");
            }
        }

        public async Task UnfollowBloggerAsync(long followingId, CancellationToken cancellationToken = default)
        {
            var followerId = await GetCurrentBloggerId(cancellationToken);

            if (followerId == followingId)
                throw new ValidationException("Cannot unfollow yourself");

            var follow = await unitOfWork.GetRepository<IBloggerFollowRepository>()
                .GetAllAsync(bf =>
                    bf.FollowerId == followerId &&
                    bf.FollowingId == followingId, cancellationToken);

            if (!follow.Any())
                throw new NotFoundException("Follow relationship not found");

            await unitOfWork.GetRepository<IBloggerFollowRepository>()
                .RemoveFollowAsync(followerId, followingId, cancellationToken);
            await unitOfWork.SaveChangesAsync(cancellationToken);
        }

        public async Task<PagedList<BloggerFollowDto>> GetFollowingWithFilterAsync(
            long bloggerId,
            SieveModel sieveModel,
            CancellationToken cancellationToken = default)
        {
            var pagedList = await unitOfWork.GetRepository<IBloggerFollowRepository>()
                .GetFollowingWithFilterAsync(bloggerId, sieveModel, cancellationToken);

            var itemsDto = mapper.Map<List<BloggerFollowDto>>(pagedList.Items);
            
            return PagedList<BloggerFollowDto>.Copy(pagedList, itemsDto);
        }

        public async Task<PagedList<BloggerFollowDto>> GetFollowersWithFilterAsync(
            long bloggerId,
            SieveModel sieveModel,
            CancellationToken cancellationToken = default)
        {
            var pagedList = await unitOfWork.GetRepository<IBloggerFollowRepository>()
                .GetFollowersWithFilterAsync(bloggerId, sieveModel, cancellationToken);

            var itemsDto = mapper.Map<List<BloggerFollowDto>>(pagedList.Items);
            
            return PagedList<BloggerFollowDto>.Copy(pagedList, itemsDto);
        }

        public async Task<IEnumerable<BloggerFollowDto>> GetFollowersAsync(long bloggerId, CancellationToken cancellationToken = default)
        {
            var followers = await unitOfWork.GetRepository<IBloggerFollowRepository>()
                .GetAllAsync(bf => bf.FollowingId == bloggerId && !bf.IsDeleted, cancellationToken);

            return mapper.Map<IEnumerable<BloggerFollowDto>>(followers);
        }

        public async Task<IEnumerable<BloggerFollowDto>> GetFollowingAsync(long bloggerId, CancellationToken cancellationToken = default)
        {
            var following = await this.unitOfWork.GetRepository<IBloggerFollowRepository>()
                .GetAllAsync(bf => bf.FollowerId == bloggerId && !bf.IsDeleted, cancellationToken);

            return mapper.Map<IEnumerable<BloggerFollowDto>>(following);
        }

        public async Task<BloggerStatsDto> GetBloggerStatsAsync(long bloggerId, CancellationToken cancellationToken = default)
        {
            var blogger = await this.unitOfWork.GetRepository<IBloggerRepository>()
                .GetByIdAsync(bloggerId, cancellationToken);

            if (blogger is null)
            {
                throw new NotFoundException($"Blogger with ID {bloggerId} was not found.");
            }

            var posts = await unitOfWork.GetRepository<IPostRepository>()
                .GetAllFullAsync(p => p.BloggerId == bloggerId, cancellationToken);

            var postDtos = mapper.Map<List<PostDto>>(posts);

            foreach (var postDto in postDtos)
            {
                var comments = await unitOfWork.GetRepository<ICommentRepository>()
                    .GetCommentsByPostIdAsync(postDto.Id);
                postDto.Comments = mapper.Map<List<CommentBroadcastDto>>(comments);
            }

            var totalLikes = posts.Sum(p => p.Likes?.Count ?? 0);
            var totalComments = posts.Sum(p => p.Comments?.Count ?? 0);

            PostDto? mostPopularPost = null;
            int maxPopularity = -1;

            foreach (var post in postDtos)
            {
                var popularity = (post.Likes?.Count ?? 0) + (post.Comments?.Count ?? 0);
                if (popularity > maxPopularity)
                {
                    maxPopularity = popularity;
                    mostPopularPost = post;
                }
            }

            var stats = new BloggerStatsDto
            {
                BloggerId = bloggerId,
                TotalLikes = totalLikes,
                TotalComments = totalComments,
                MostPopularPost = mostPopularPost != null
                    ? mostPopularPost
                    : null
            };

            return stats;
        }

        private void MaskBloggerDetails(BloggerDto dto)
        {
            dto.FirstName = "Restricted";
            dto.LastName = "User";
            dto.Bio = null;
            dto.BirthDate = null;
            dto.Sex = null;
            dto.Image = null;
        }

        private async Task EnsureUserCanModifyBloggerAsync(Blogger blogger)
        {
            var bloggerId = await this.GetCurrentBloggerId();

            if (blogger.Id != bloggerId)
            {
                throw new PermissionsException();
            }
        }

        private async Task EnsureUserCanDeleteBloggerAsync(Blogger blogger)
        {
            var bloggerId = await this.GetCurrentBloggerId();
            var userRoles = this.contextAccessor.GetCurrentUserRoles();

            if (blogger.Id != bloggerId && !userRoles.Contains("Admin"))
            {
                throw new PermissionsException();
            }
        }

        private async Task<long> GetCurrentBloggerIdSafeAsync(CancellationToken cancellationToken)
        {
            try
            {
                var userId = this.contextAccessor.GetCurrentUserId();
                var blogger = await this.unitOfWork.GetRepository<IBloggerRepository>()
                    .AsQueryable()
                    .FirstOrDefaultAsync(b => b.UserId == userId && !b.IsDeleted, cancellationToken);

                return blogger?.Id ?? -1;
            }
            catch (NotAuthorizedException)
            {
                return -1;
            }
            catch (NotFoundException)
            {
                return -1;
            }
        }

        private static (string containerName, string fileName) ExtractBlobInfo(string uri)
        {
            try
            {
                var uriParts = new Uri(uri).AbsolutePath.Trim('/').Split('/');

                if (uriParts.Length < 2)
                {
                    return (string.Empty, string.Empty);
                }

                var containerName = uriParts[0];
                var fileName = string.Join("/", uriParts.Skip(1));

                return (containerName, fileName);
            }
            catch
            {
                return (string.Empty, string.Empty);
            }
        }
    }
}
