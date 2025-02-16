using AutoMapper;
using System.Globalization;
using TravelTales.Application.DTOs.Attachment;
using TravelTales.Application.Exceptions;
using TravelTales.Application.Interfaces;
using TravelTales.Domain.Entities;
using TravelTales.Persistence.Interfaces;

namespace TravelTales.Application.Services
{
    public class AttachmentService : IAttachmentService
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly IMapper mapper;
        private readonly IContextAccessor contextAccessor;
        private readonly IStorageService blobStorageService;

        public AttachmentService(
            IUnitOfWork unitOfWork,
            IMapper mapper,
            IContextAccessor contextAccessor,
            IStorageService blobStorageService)
        {
            this.unitOfWork = unitOfWork;
            this.mapper = mapper;
            this.contextAccessor = contextAccessor;
            this.blobStorageService = blobStorageService;
        }

        public async Task DeleteAttachmentAsync(long id, CancellationToken cancellationToken = default)
        {
            var attachment = await this.unitOfWork
                .GetRepository<IAttachmentRepository>()
                .GetByIdAsync(id, cancellationToken);

            if (attachment is null)
            {
                throw new NotFoundException($"Attachment with ID {id} was not found.");
            }

            if (!string.IsNullOrEmpty(attachment.Uri))
            {
                var (containerName, fileName) = ExtractBlobInfo(attachment.Uri);

                if (!string.IsNullOrEmpty(containerName) && !string.IsNullOrEmpty(fileName))
                {
                    await this.blobStorageService.DeleteAsync(containerName, fileName);
                }
            }

            this.unitOfWork.GetRepository<IAttachmentRepository>().Delete(attachment);
            await this.unitOfWork.SaveChangesAsync(cancellationToken);
        }


        public async Task<AttachmentDto> UploadAttachmentAsync(UploadAttachmentDto uploadAttachmentDto, CancellationToken cancellationToken = default)
        {
            var createAttachmentDto = new CreateAttachmentDto();
            if (uploadAttachmentDto.AttachmentBytes != null)
            {
                var stream = new MemoryStream(uploadAttachmentDto.AttachmentBytes);
                var blobUri =
                    await this.blobStorageService.UploadAsync(stream, "attachments", "file-attachment"+uploadAttachmentDto.PostId.ToString(CultureInfo.InvariantCulture)+"-num"+ uploadAttachmentDto.Number.ToString(CultureInfo.InvariantCulture));

                createAttachmentDto.Uri = blobUri;
                createAttachmentDto.PostId = uploadAttachmentDto.PostId;
            }

            //this.EnsureUserCanModifyPost(post);

            ArgumentNullException.ThrowIfNull(uploadAttachmentDto);

            var attachment = this.mapper.Map<Attachment>(createAttachmentDto);

            await this.unitOfWork.GetRepository<IAttachmentRepository>().AddAsync(attachment, cancellationToken);
            await this.unitOfWork.SaveChangesAsync(cancellationToken);

            return this.mapper.Map<AttachmentDto>(attachment);
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
