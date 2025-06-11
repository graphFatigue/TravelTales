using AutoMapper;
using FluentValidation;
using Sieve.Models;
using TravelTales.Application.DTOs.Category;
using TravelTales.Application.Exceptions;
using TravelTales.Application.Interfaces;
using TravelTales.Domain.Entities;
using TravelTales.Persistence.Interfaces;
using TravelTales.Persistence.SharedFiles;

namespace TravelTales.Application.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly IMapper mapper;

        private readonly IContextAccessor contextAccessor;

        public CategoryService(
            IUnitOfWork unitOfWork,
            IMapper mapper,
            IContextAccessor contextAccessor)
        {
            this.unitOfWork = unitOfWork;
            this.mapper = mapper;
            this.contextAccessor = contextAccessor;
        }

        public async Task<CategoryDto> CreateCategoryAsync(CreateCategoryDto createCategoryDto, CancellationToken cancellationToken = default)
        {
            var category = this.mapper.Map<Category>(createCategoryDto);

            await this.unitOfWork.GetRepository<ICategoryRepository>().AddAsync(category, cancellationToken);
            await this.unitOfWork.SaveChangesAsync(cancellationToken);

            return this.mapper.Map<CategoryDto>(category);
        }

        public async Task DeleteCategoryAsync(long id, CancellationToken cancellationToken = default)
        {
            var category = await this.unitOfWork
                .GetRepository<ICategoryRepository>()
                .GetByIdAsync(id, cancellationToken);
            if (category is null)
            {
                throw new NotFoundException($"Category with ID {id} was not found.");
            }


            this.unitOfWork.GetRepository<ICategoryRepository>().Delete(category);
            await this.unitOfWork.SaveChangesAsync(cancellationToken);
        }

        public async Task<IEnumerable<CategoryDto>> GetCategoriesAsync(CancellationToken cancellationToken = default)
        {
            var categories = await this.unitOfWork.GetRepository<ICategoryRepository>()
                .GetAllAsync(cancellationToken);
            return this.mapper.Map<IEnumerable<CategoryDto>>(categories);
        }

        public async Task<PagedList<CategoryDto>> GetCategoriesWithFilterAsync(SieveModel sieveModel, CancellationToken cancellationToken = default)
        {
            var pagedList = await this.unitOfWork.GetRepository<ICategoryRepository>()
                .GetAllWithFilterAsync(sieveModel, cancellationToken);

            var filteredCategories = this.mapper.Map<IEnumerable<CategoryDto>>(pagedList.Items);

            var updatedPagedList = PagedList<CategoryDto>.Copy(pagedList, filteredCategories);

            return updatedPagedList;
        }

        public async Task<CategoryDto?> GetCategoryByIdAsync(long id, CancellationToken cancellationToken = default)
        {
            var category = await this.unitOfWork
                .GetRepository<ICategoryRepository>()
                .GetByIdAsync(id, cancellationToken);
            if (category is null)
            {
                throw new NotFoundException($"Category with ID {id} was not found.");
            }

            return this.mapper.Map<CategoryDto>(category);
        }

        public async Task UpdateCategoryAsync(long id, UpdateCategoryDto updateCategoryDto, CancellationToken cancellationToken = default)
        {
            var category = await this.unitOfWork.GetRepository<ICategoryRepository>()
                .GetByIdAsync(id, cancellationToken);

            if (category is null)
            {
                throw new NotFoundException($"Category with ID {id} was not found.");
            }

            ArgumentNullException.ThrowIfNull(updateCategoryDto);

            category.Name = updateCategoryDto.Name;
            category.Description = updateCategoryDto.Description;
            category.NameUa = updateCategoryDto.NameUa;
            category.DescriptionUa = updateCategoryDto.DescriptionUa;

            this.unitOfWork.GetRepository<ICategoryRepository>().Update(category);
            await this.unitOfWork.SaveChangesAsync(cancellationToken);
        }
    }
}
