using AutoMapper;
using FluentValidation;
using Sieve.Models;
using TravelTales.Application.DTOs.Notification;
using TravelTales.Application.Exceptions;
using TravelTales.Application.Interfaces;
using TravelTales.Domain.Entities;
using TravelTales.Persistence;
using TravelTales.Persistence.Interfaces;
using TravelTales.Persistence.SharedFiles;

namespace TravelTales.Application.Services
{

    public class NotificationService : INotificationService
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly IMapper mapper;
        private readonly IBloggerBlockRepository blockerRepository;
        private readonly IBloggerService bloggerService;

        public NotificationService(
            IUnitOfWork unitOfWork,
            IMapper mapper,
            IBloggerService bloggerService,
            IBloggerBlockRepository blockerRepository)
        {
            this.unitOfWork = unitOfWork;
            this.mapper = mapper;
            this.bloggerService = bloggerService;
            this.blockerRepository = blockerRepository;
        }

        public async Task<NotificationDto> CreateNotificationAsync(CreateNotificationDto notificationDto, CancellationToken cancellationToken = default)
        {

            var notification = mapper.Map<Notification>(notificationDto);
            await unitOfWork.GetRepository<INotificationRepository>().AddAsync(notification, cancellationToken);
            await unitOfWork.SaveChangesAsync(cancellationToken);

            // Load related data for proper mapping
            var createdNotification = await unitOfWork.GetRepository<INotificationRepository>()
                .GetByIdFullAsync(notification.Id, cancellationToken);

            return mapper.Map<NotificationDto>(createdNotification);
        }

        public async Task<List<NotificationDto>> GetNotificationsForBloggerAsync(long bloggerId, CancellationToken cancellationToken = default)
        {
            var notifications = await unitOfWork.GetRepository<INotificationRepository>()
                .GetByRecipientIdFullAsync(bloggerId, cancellationToken);

            var blockedIds = await blockerRepository.GetBlockedBloggerIdsAsync(bloggerId, cancellationToken);
            var dtos = mapper.Map<List<NotificationDto>>(notifications);

            // Mask blocked users
            foreach (var dto in dtos)
            {
                if (dto.TriggeredByBlogger != null && blockedIds.Contains(dto.TriggeredByBlogger.Id))
                {
                    dto.TriggeredByBlogger.FirstName = "Restricted";
                    dto.TriggeredByBlogger.LastName = "User";
                    dto.TriggeredByBlogger.Bio = null;
                    dto.TriggeredByBlogger.BirthDate = null;
                    dto.TriggeredByBlogger.Sex = null;
                    dto.TriggeredByBlogger.Image = null;
                }
            }

            return dtos;
        }

        public async Task MarkAsReadAsync(long notificationId, CancellationToken cancellationToken = default)
        {
            var notification = await this.unitOfWork.GetRepository<INotificationRepository>()
                .GetByIdAsync(notificationId, cancellationToken);

            if (notification == null || notification.IsDeleted)
                throw new NotFoundException("Notification not found");

            var currentBloggerId = await this.bloggerService.GetCurrentBloggerId(cancellationToken);
            if (notification.RecipientBloggerId != currentBloggerId)
                throw new PermissionsException("Cannot modify another user's notifications");

            notification.IsRead = true;
            unitOfWork.GetRepository<INotificationRepository>().Update(notification);
            await unitOfWork.SaveChangesAsync(cancellationToken);
        }

        public async Task<PagedList<NotificationDto>> GetNotificationsAsync(SieveModel sieveModel, CancellationToken cancellationToken = default)
        {
            var currentBloggerId = await this.bloggerService.GetCurrentBloggerId(cancellationToken);

            var bloggerFilter = $"RecipientBloggerId=={currentBloggerId}";

            if (string.IsNullOrWhiteSpace(sieveModel.Filters))
            {
                sieveModel.Filters = bloggerFilter;
            }
            else
            {
                sieveModel.Filters += $";{bloggerFilter}";
            }

            var pagedList = await this.unitOfWork.GetRepository<INotificationRepository>()
                .GetAllWithFilterAsync(sieveModel, cancellationToken);

            var filteredNotifications = pagedList.Items?
                .ToList();

            var dtos = this.mapper.Map<List<NotificationDto>>(filteredNotifications);

            return PagedList<NotificationDto>.Copy(pagedList, dtos);
        }

        public async Task MarkAllAsReadAsync(CancellationToken cancellationToken = default)
        {
            var currentBloggerId = await this.bloggerService.GetCurrentBloggerId(cancellationToken);

            var notifications = await this.unitOfWork.GetRepository<INotificationRepository>()
                .GetAllAsync(n =>
                    n.RecipientBloggerId == currentBloggerId &&
                    !n.IsDeleted &&
                    !n.IsRead,
                    cancellationToken);

            foreach (var notification in notifications)
            {
                notification.IsRead = true;
                this.unitOfWork.GetRepository<INotificationRepository>().Update(notification);
            }

            await this.unitOfWork.SaveChangesAsync(cancellationToken);
        }
    }
}
