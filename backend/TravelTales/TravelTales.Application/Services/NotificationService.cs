using AutoMapper;
using FluentValidation;
using TravelTales.Application.DTOs.Notification;
using TravelTales.Application.Exceptions;
using TravelTales.Application.Interfaces;
using TravelTales.Domain.Entities;
using TravelTales.Persistence.Interfaces;

namespace TravelTales.Application.Services
{
    public class NotificationService : INotificationService
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly IMapper mapper;
        private readonly IValidator<CreateNotificationDto> validator;

        public NotificationService(
            IUnitOfWork unitOfWork,
            IMapper mapper,
            IValidator<CreateNotificationDto> validator)
        {
            this.unitOfWork = unitOfWork;
            this.mapper = mapper;
            this.validator = validator;
        }

        public async Task<NotificationDto> CreateNotificationAsync(CreateNotificationDto notificationDto, CancellationToken cancellationToken = default)
        {
            await validator.ValidateAndThrowAsync(notificationDto, cancellationToken);

            var notification = mapper.Map<Notification>(notificationDto);
            notification.CreatedAt = DateTime.UtcNow;

            await unitOfWork.GetRepository<INotificationRepository>().AddAsync(notification, cancellationToken);
            await unitOfWork.SaveChangesAsync(cancellationToken);

            return mapper.Map<NotificationDto>(notification);
        }

        public async Task<List<NotificationDto>> GetNotificationsForBloggerAsync(long bloggerId, CancellationToken cancellationToken = default)
        {
            var notifications = await unitOfWork.GetRepository<INotificationRepository>()
                .GetByRecipientIdAsync(bloggerId, cancellationToken);

            return mapper.Map<List<NotificationDto>>(notifications);
        }

        public async Task MarkAsReadAsync(long notificationId, CancellationToken cancellationToken = default)
        {
            var notification = await unitOfWork.GetRepository<INotificationRepository>()
                .GetByIdAsync(notificationId, cancellationToken);

            if (notification == null || notification.IsDeleted)
                throw new NotFoundException("Notification not found");

            notification.IsRead = true;
            unitOfWork.GetRepository<INotificationRepository>().Update(notification);
            await unitOfWork.SaveChangesAsync(cancellationToken);
        }
    }
}
