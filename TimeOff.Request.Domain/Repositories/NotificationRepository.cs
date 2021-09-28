using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using TimeOff.Request.DataAccess;
using TimeOff.Request.Domain.Shared.Entities;
using TimeOff.Request.Domain.Shared.Repositories;

namespace TimeOff.Request.Domain.Repositories
{
    public class NotificationRepository : INotificationRepository
    {
        private readonly AppDbContext _db;

        public NotificationRepository(AppDbContext db)
        {
            this._db = db;
        }

        public NotificationEntity Create(NotificationEntity entity)
        {
            var notification = _db.Notifications.Where(n => n.Id == entity.Id);

            if (notification.Count() > 0) {
                throw new Exception("User already exists.");
            }

            return _db.Notifications.Add(entity).Entity;
        }

        public void Delete(int id)
        {
            var notification = _db.Notifications.First(n => n.Id == id);
            if (notification == null)
            {
                throw new Exception("Notification does not exist.");
            }
            _db.Remove(notification);
        }

        public IQueryable<NotificationEntity> Get()
        {
            return _db.Notifications;
        }

        public NotificationEntity Get(int id)
        {
            var n = _db.Notifications
                .First(n => n.Id == id);
            if (n == null)
            {
                throw new Exception($"Notification with id: {id}) does not exist.");
            }
            return n;
        }

        public NotificationEntity Update(int id, NotificationEntity entity)
        {
            var notification = _db.Notifications.First(n => n.Id == id);

            if (notification == null)
            {
                throw new Exception("Notification does not exist.");
            }

            _db.Entry(notification).CurrentValues.SetValues(entity);

            return notification;
        }
    }
}
