using AutoMapper;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Sieve.Models;
using System.Linq;
using TravelTales.Application.DTOs.Blogger;
using TravelTales.Application.DTOs.BloggerFollow;
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

        public BloggerService(
            IUnitOfWork unitOfWork,
            IMapper mapper,
            IValidator<CreateBloggerDto> createBloggerDtoValidator,
            IValidator<UpdateBloggerDto> updateBloggerDtoValidator,
            IContextAccessor contextAccessor,
            IStorageService blobStorageService)
        {
            this.unitOfWork = unitOfWork;
            this.mapper = mapper;
            this.createBloggerDtoValidator = createBloggerDtoValidator;
            this.updateBloggerDtoValidator = updateBloggerDtoValidator;
            this.contextAccessor = contextAccessor;
            this.blobStorageService = blobStorageService;
        }

        public async Task<BloggerDto> CreateBloggerAsync(CreateBloggerDto createBloggerDto, CancellationToken cancellationToken = default)
        {
            await this.createBloggerDtoValidator.ValidateAndThrowAsync(createBloggerDto, cancellationToken: cancellationToken);
            var blogger = this.mapper.Map<Blogger>(createBloggerDto);

            await this.unitOfWork.GetRepository<BloggerRepository>().AddAsync(blogger, cancellationToken);
            await this.unitOfWork.SaveChangesAsync(cancellationToken);

            return this.mapper.Map<BloggerDto>(blogger);
        }

        public async Task DeleteBloggerAsync(long id, CancellationToken cancellationToken = default)
        {
            var blogger = await this.unitOfWork
                .GetRepository<IBloggerRepository>()
                .GetByIdAsync(id, cancellationToken);
            if (blogger is null)
            {
                throw new NotFoundException($"Blogger with ID {id} was not found.");
            }

            //this.EnsureUserCanModifyPost(post);

            this.unitOfWork.GetRepository<IBloggerRepository>().Delete(blogger);
            await this.unitOfWork.SaveChangesAsync(cancellationToken);
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
                .GetByIdAsync(id, cancellationToken);

            if (blogger is null)
            {
                throw new NotFoundException($"Blogger with ID {id} was not found.");
            }

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

            // Update visited cities
            blogger.VisitedCities.Clear();
            foreach (var cityId in updateBloggerDto.VisitedCityIds)
            {
                var city = await unitOfWork.GetRepository<ICityRepository>()
                    .GetByIdAsync(cityId, cancellationToken);
                if (city == null)
                    throw new ValidationException($"City with ID {cityId} not found.");
                blogger.VisitedCities.Add(city);
            }

            // Update visited countries
            blogger.VisitedCountries.Clear();
            foreach (var countryId in updateBloggerDto.VisitedCountryIds)
            {
                var country = await unitOfWork.GetRepository<ICountryRepository>()
                    .GetByIdAsync(countryId, cancellationToken);
                if (country == null)
                    throw new ValidationException($"Country with ID {countryId} not found.");
                blogger.VisitedCountries.Add(country);
            }

            //this.EnsureUserCanModifyPost(post);

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

        //public async Task FollowBloggerAsync(long followingId, CancellationToken cancellationToken = default)
        //{
        //    var followerId = await GetCurrentBloggerId(cancellationToken);

        //    if (followerId == followingId)
        //        throw new ValidationException("Cannot follow yourself");

        //    if (await unitOfWork.GetRepository<IBloggerFollowRepository>()
        //        .ExistsAsync(followerId, followingId, cancellationToken))
        //    {
        //        throw new ValidationException("Already following this blogger");
        //    }

        //    var follow = new BloggerFollow
        //    {
        //        FollowerId = followerId,
        //        FollowingId = followingId
        //    };

        //    await unitOfWork.GetRepository<IBloggerFollowRepository>().AddAsync(follow, cancellationToken);
        //    await unitOfWork.SaveChangesAsync(cancellationToken);
        //}

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
                    bf.FollowingId == followingId &&
                    !bf.IsDeleted, cancellationToken);

            if (!follow.Any())
                throw new NotFoundException("Follow relationship not found");

            await unitOfWork.GetRepository<IBloggerFollowRepository>()
                .RemoveFollowAsync(followerId, followingId, cancellationToken);
            await unitOfWork.SaveChangesAsync(cancellationToken);
        }

        public async Task<IEnumerable<BloggerFollowDto>> GetFollowersAsync(long bloggerId, CancellationToken cancellationToken = default)
        {
            var followers = await unitOfWork.GetRepository<IBloggerFollowRepository>()
                .GetAllAsync(bf => bf.FollowingId == bloggerId && !bf.IsDeleted, cancellationToken);

            return mapper.Map<IEnumerable<BloggerFollowDto>>(followers);
        }

        public async Task<IEnumerable<BloggerFollowDto>> GetFollowingAsync(long bloggerId, CancellationToken cancellationToken = default)
        {
            var following = await unitOfWork.GetRepository<IBloggerFollowRepository>()
                .GetAllAsync(bf => bf.FollowerId == bloggerId && !bf.IsDeleted, cancellationToken);

            return mapper.Map<IEnumerable<BloggerFollowDto>>(following);
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
