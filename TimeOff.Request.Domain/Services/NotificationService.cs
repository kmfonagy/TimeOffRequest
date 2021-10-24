using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using TimeOff.Request.DataAccess;
using TimeOff.Request.Domain.Shared.Entities;
using TimeOff.Request.Domain.Shared.Repositories;
using TimeOff.Request.Domain.Shared.Services;

namespace TimeOff.Request.Domain.Services
{
    public class NotificationService : INotificationService
    {
        private readonly INotificationRepository _notificationRepo;
        private readonly AppDbContext _db;

        public NotificationService(INotificationRepository notiRepo, AppDbContext db)
        {
            this._notificationRepo = notiRepo;
            this._db = db;
        }

        public IEnumerable<NotificationEntity> ReadNotifications(int userId)
        {
            return _notificationRepo.Get()
                .Include(n => n.NotifyUser)
                .Where(n => n.Read && n.NotifyUserId == userId);
        }

        public IEnumerable<NotificationEntity> UnreadNotifications(int userId)
        {
            return _notificationRepo.Get()
                .Include(n => n.NotifyUser)
                .Where(n => !n.Read && n.NotifyUserId == userId);
        }
    }
}
