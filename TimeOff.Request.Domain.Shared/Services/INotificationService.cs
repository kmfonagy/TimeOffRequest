using System;
using System.Collections.Generic;
using TimeOff.Request.Domain.Shared.Entities;

namespace TimeOff.Request.Domain.Shared.Services
{
    public interface INotificationService
    {
        public IEnumerable<NotificationEntity> ReadNotifications();

        public IEnumerable<NotificationEntity> UnreadNotifications();
    }
}
