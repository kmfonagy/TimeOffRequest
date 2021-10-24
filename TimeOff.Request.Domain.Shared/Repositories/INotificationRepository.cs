using System;
using TimeOff.Request.Domain.Shared.Entities;

namespace TimeOff.Request.Domain.Shared.Repositories
{
    public interface INotificationRepository : IRepository<NotificationEntity, int>
    {
    }
}
