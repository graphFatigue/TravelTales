using TravelTales.Application.DTOs.BloggerBlock;
using TravelTales.Application.Interfaces;
using TravelTales.Domain.Entities;
using TravelTales.Persistence.Interfaces;

namespace TravelTales.Application.Services
{
    public class BloggerBlockService : IBloggerBlockService
    {
        private readonly IUnitOfWork unitOfWork;
        public BloggerBlockService(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public async Task BlockBloggerAsync(BlockBloggerDto dto)
        {
            if (dto.BlockerId == dto.BlockedId)
                throw new ArgumentException("Cannot block oneself.");

            // Check if already blocked
            var existing = await this.unitOfWork.GetRepository<IBloggerBlockRepository>()
                                            .GetAsync(dto.BlockerId, dto.BlockedId);
            if (existing != null)
                throw new InvalidOperationException("User is already blocked.");

            // Create and save new block record
            var block = new BloggerBlock
            {
                BlockerId = dto.BlockerId,
                BlockedId = dto.BlockedId
            };
            this.unitOfWork.GetRepository<IBloggerBlockRepository>().Add(block);
            await this.unitOfWork.SaveChangesAsync();
        }

        public async Task UnblockBloggerAsync(UnblockBloggerDto dto)
        {
            // Find existing block record
            var existing = await this.unitOfWork.GetRepository<IBloggerBlockRepository>()
                                            .GetAsync(dto.BlockerId, dto.UnblockedId);
            if (existing == null)
                throw new InvalidOperationException("User is not currently blocked.");

            // Remove and save
            this.unitOfWork.GetRepository<IBloggerBlockRepository>().Remove(existing);
            await this.unitOfWork.SaveChangesAsync();
        }

        public async Task<bool> IsBlockedAsync(long blockerId, long blockedId)
        {
            var block = await this.unitOfWork.GetRepository<IBloggerBlockRepository>()
                                        .GetAsync(blockerId, blockedId);
            return block != null;
        }

        public async Task<IEnumerable<long>> GetBlockedBloggerIdsAsync(long blockerId)
        {
            return await this.unitOfWork.GetRepository<IBloggerBlockRepository>()
                                    .GetBlockedBloggerIdsAsync(blockerId);
        }
    }
}
