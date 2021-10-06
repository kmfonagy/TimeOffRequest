using System;
using System.Collections.Generic;
using TimeOff.Request.Domain.Shared.Entities;

namespace TimeOff.Request.Domain.Shared.Services
{
    public interface INotificationService
    {
        public IEnumerable<NotificationEntity> ReadNotifications(int userId);

        public IEnumerable<NotificationEntity> UnreadNotifications(int userId);
    }
}
