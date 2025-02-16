using AutoMapper;
using FluentValidation;
using Sieve.Models;
using TravelTales.Application.DTOs.Blogger;
using TravelTales.Application.Exceptions;
using TravelTales.Application.Interfaces;
using TravelTales.Domain.Entities;
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

        public async Task<BloggerDto?> GetBloggerByIdAsync(long id, CancellationToken cancellationToken = default)
        {
            var blogger = await this.unitOfWork
                .GetRepository<IBloggerRepository>()
                .GetByIdFullAsync(id, cancellationToken);
            if (blogger is null)
            {
                throw new NotFoundException($"Blogger with ID {id} was not found.");
            }

            return this.mapper.Map<BloggerDto>(blogger);
        }

        public async Task<IEnumerable<BloggerDto>> GetBloggersAsync(CancellationToken cancellationToken = default)
        {
            var bloggers = await this.unitOfWork.GetRepository<IBloggerRepository>()
                .GetAllAsync(cancellationToken);
            return this.mapper.Map<IEnumerable<BloggerDto>>(bloggers);
        }

        public async Task<PagedList<BloggerDto>> GetBloggersWithFilterAsync(SieveModel sieveModel, CancellationToken cancellationToken = default)
        {
            var pagedList = await this.unitOfWork.GetRepository<IBloggerRepository>()
                .GetAllWithFilterAsync(sieveModel, cancellationToken);

            var filteredBloggers = this.mapper.Map<IEnumerable<BloggerDto>>(pagedList.Items);

            var updatedPagedList = PagedList<BloggerDto>.Copy(pagedList, filteredBloggers);

            return updatedPagedList;
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

            //this.EnsureUserCanModifyPost(post);

            ArgumentNullException.ThrowIfNull(updateBloggerDto);


            this.unitOfWork.GetRepository<IBloggerRepository>().Update(blogger);
            await this.unitOfWork.SaveChangesAsync(cancellationToken);
        }

        public async Task UpdateBloggerImageAsync(long id, UpdateBloggerImageDto updateBloggerImageDto, CancellationToken cancellationToken = default)
        {
            var blogger = await this.unitOfWork.GetRepository<IBloggerRepository>()
                .GetByIdAsync(id, cancellationToken);

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

                string fileName = $"{blogger.User.Email}-{Guid.NewGuid()}.jpg";

                var blobUri = await this.blobStorageService.UploadAsync(stream, "user-photos", fileName);

                blogger.Image = blobUri;
            }

            this.unitOfWork.GetRepository<IBloggerRepository>().Update(blogger);
            await this.unitOfWork.SaveChangesAsync(cancellationToken);
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
