using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using TimeOff.Request.Domain.Shared.Entities;
using TimeOff.Request.Domain.Shared.Models;
using TimeOff.Request.Domain.Shared.Repositories;
using TimeOff.Request.Domain.Shared.Services;
using TimeOff.Request.Helpers;

namespace TimeOff.Request.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationController : Controller
    {
        private readonly INotificationRepository _notificationRepo;
        private readonly IUnitOfWork _unitOfWork;
        private readonly INotificationService _notificationService;

        public NotificationController(INotificationRepository notificationRepo, IUnitOfWork unitOfWork, INotificationService notificationService)
        {
            this._notificationRepo = notificationRepo;
            this._unitOfWork = unitOfWork;
            this._notificationService = notificationService;
        }

        /// <summary>
        /// Gets all the notifications
        /// </summary>
        /// <returns>A list of notifications</returns>
        [HttpGet]
        public ActionResult<IEnumerable<Notification>> Get()
        {
            try {
                return _notificationRepo.Get().Select(n => n.Map<Notification>()).ToList();
            }
            catch (Exception ex) {
                return NotFound(ex.Message);
            }
        }

        /// <summary>
        /// Gets all Unread notifications for a specific user
        /// </summary>
        /// <param name="userId">The id of the user trying to get their notifications</param>
        /// <returns>A list of unread notifications</returns>
        [HttpGet("Unread")]
        public ActionResult<IEnumerable<Notification>> GetUnreadNotifications(int userId)
        {
            try
            {
                return _notificationService.UnreadNotifications(userId).Select(n => n.Map<Notification>()).ToList();
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

        /// <summary>
        /// Gets all read notifications for a specific user
        /// </summary>
        /// <param name="userId">The id of the user trying to get their notifications</param>
        /// <returns>A list of read notifications</returns>
        [HttpGet("Read")]
        public ActionResult<IEnumerable<Notification>> GetReadNotifications(int userId)
        {
            try
            {
                return _notificationService.ReadNotifications(userId).Select(n => n.Map<Notification>()).ToList();
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

        /// <summary>
        /// Gets a specific notification.
        /// </summary>
        /// <param name="id">The notification id to retrieve</param>
        /// <returns>A specific notification</returns>
        [HttpGet("{id}")]
        public ActionResult<Notification> Get(int id)
        {
            try
            {
                return _notificationRepo.Get(id).Map<Notification>();
            }
            catch (Exception ex)
            {
                return NotFound($"Notification with id={id} was not found. \n {ex.Message}");
            }
        }

        /// <summary>
        /// Updates a Notification
        /// </summary>
        /// <param name="id">The notification id that needs to be updated</param>
        /// <param name="updatedNotification">The notification that needs to be updated</param>
        /// <returns>The notifcation that was updated</returns>
        [HttpPut("{id}")]
        public ActionResult<Notification> Put(int id, [FromBody] Notification updatedNotification)
        {
            try
            {
                NotificationEntity n = _notificationRepo.Update(id, updatedNotification.Map<NotificationEntity>());

                _unitOfWork.SaveChanges();

                return n.Map<Notification>();
            }
            catch (Exception ex)
            {
                return BadRequest("Notification could not be updated with the provided information.\n " + ex.Message);
            }
        }

        /// <summary>
		/// Deletes a notification
		/// </summary>
		/// <param name="id">The notification id to delete.</param>
		/// <returns></returns>
		[HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {

            try
            {
                _notificationRepo.Delete(id);
                _unitOfWork.SaveChanges();
                return Ok();
            }
            catch (Exception ex)
            {
                return NotFound($"Could not delete notification with id = {id}.\n{ex.Message}");
            }
        }

        /// <summary>
        /// Creates a notification
        /// </summary>
        /// <param name="notification">The notification to be added</param>
        /// <returns>The notification that was added</returns>
        [HttpPost]
        public ActionResult<Notification> Post([FromBody] Notification notification)
        {
            try
            {
                notification.CreatedDate = DateTimeOffset.Now;

                var n = _notificationRepo.Create(notification.Map<NotificationEntity>());

                _unitOfWork.SaveChanges();

                return n.Map<Notification>();
            }
            catch (Exception ex)
            {
                return BadRequest("Notification could not be created with the provided parameters.\n" + ex.Message);
            }
        }
    }
}
