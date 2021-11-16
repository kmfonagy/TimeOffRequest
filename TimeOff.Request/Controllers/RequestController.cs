using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using TimeOff.Request.Domain.Shared.Entities;
using TimeOff.Request.Domain.Shared.Models;
using TimeOff.Request.Domain.Shared.Repositories;
using TimeOff.Request.Domain.Shared.Services;
using TimeOff.Request.Helpers;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace TimeOff.Request.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RequestController : Controller
    {
        private readonly IRequestRepository _reqRepo;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IRequestService _reqService;
        private readonly INotificationRepository _notificationRepo;

        public RequestController(IRequestRepository reqRepo, IUnitOfWork unitOfWork, IRequestService reqService, INotificationRepository notiRepo)
        {
            this._reqRepo = reqRepo;
            this._unitOfWork = unitOfWork;
            this._reqService = reqService;
            this._notificationRepo = notiRepo;
        }

        /// <summary>
        /// Gets all requests
        /// </summary>
        /// <returns>A list of requests</returns>
        [HttpGet]
        public ActionResult<IEnumerable<Domain.Shared.Models.Request>> Get()
        {
            try
            {
                return _reqRepo.Get().Select(r => r.Map<Domain.Shared.Models.Request>()).ToList();
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

        /// <summary>
        /// Gets all active requests.
        /// </summary>
        /// <returns>A list of active requests</returns>
        [HttpGet("Active")]
        public ActionResult<IEnumerable<Domain.Shared.Models.Request>> GetActiveRequests()
        {
            try
            {
                return _reqService.ActiveRequests().Select(r => r.Map<Domain.Shared.Models.Request>()).ToList();
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

        /// <summary>
        /// Gets a specific request
        /// </summary>
        /// <param name="id">The request id to retreive</param>
        /// <returns>A specific request</returns>
        [HttpGet("{id}")]
        public ActionResult<Domain.Shared.Models.Request> Get(int id)
        {
            try
            {
                return _reqRepo.Get(id).Map<Domain.Shared.Models.Request>();
            }
            catch (Exception ex)
            {
                return NotFound($"Request with id={id} was not found.\n {ex.Message}");
            }
        }

        /// <summary>
		/// Gets the requests that belong to a specific user
		/// </summary>
		/// <param name="createdById">The user id who created the requests</param>
		/// <returns>A list of requests</returns>
		[HttpGet("CreatedBy/{createdById}")]
        public ActionResult<IEnumerable<Domain.Shared.Models.Request>> GetUserRequests(int createdById)
        {

            try
            {
                return _reqService.CreatedBy(createdById).Select(r => r.Map<Domain.Shared.Models.Request>()).ToList();
            }
            catch (Exception ex)
            {
                return NotFound($"User with id={createdById} was not found.\n {ex.Message}");
            }
        }

        /// <summary>
        /// Gets the requests approved by a specific user
        /// </summary>
        /// <param name="approvedById">The user id who approved the requests</param>
        /// <returns>A list of requests</returns>
        [HttpGet("ApprovedBy/{approvedById}")]
        public ActionResult<IEnumerable<Domain.Shared.Models.Request>> GetUserApprovals(int approvedById)
        {

            try
            {
                return _reqService.ApprovedBy(approvedById).Select(r => r.Map<Domain.Shared.Models.Request>()).ToList();
            }
            catch (Exception ex)
            {
                return NotFound($"User with id={approvedById} was not found.\n {ex.Message}");
            }
        }

        /// <summary>
        /// Creates a request
        /// </summary>
        /// <param name="req">The request to be created</param>
        /// <returns>The request that was added</returns>
        [HttpPost]
        public ActionResult<Domain.Shared.Models.Request> CreateRequest([FromBody] Domain.Shared.Models.Request req)
        {

            try
            {
                req.CreatedDate = DateTimeOffset.Now;

                var r = _reqRepo.Create(req.Map<RequestEntity>());

                _unitOfWork.SaveChanges();

                var u = _reqRepo.Get(r.Id).CreatedBy;

                var n = _notificationRepo.Create(new NotificationEntity {
                    RequestId = r.Id,
                    Description = u.Name + " has requested time off."
                });
                if (u.SupervisorId == null)
                {
                    n.NotifyUserId = u.Id;
                }
                else
                {
                    n.NotifyUserId = (int)u.SupervisorId;
                }

                if (u.SupervisorId == null) {
                    n.NotifyUserId = u.Id;
                }
                else {
                    n.NotifyUserId = (int)u.SupervisorId;
                }

                _unitOfWork.SaveChanges();

                return r.Map<Domain.Shared.Models.Request>();
            }

            catch (Exception ex)
            {
                return BadRequest("Request could not be created with the provided parameters.\n " + ex.Message);
            }
        }

        /// <summary>
        /// Updates a request
        /// </summary>
        /// <param name="id">The request id that needs to be updated</param>
        /// <param name="updatedReq">The request to be updated</param>
        /// <returns>The request that was updated.</returns>
        [HttpPut("{id}")]
        public ActionResult<Domain.Shared.Models.Request> Put(int id, [FromBody] Domain.Shared.Models.Request updatedReq)
        {

            try
            {
                var originalStart = _reqRepo.Get(id).StartDate;
                var originalEnd = _reqRepo.Get(id).EndDate;

                RequestEntity r = _reqRepo.Update(id, updatedReq.Map<RequestEntity>());

                _unitOfWork.SaveChanges();

                var u = _reqRepo.Get(r.Id).CreatedBy;

                var desc = "No description set!";

                if (r.Canceled == true)
                {
                    desc = "Request number " + r.Id + " was denied.";
                    _notificationRepo.Create(new NotificationEntity
                    {
                        RequestId = r.Id,
                        NotifyUserId = u.Id,
                        Description = desc
                    });
                }
                else if (originalStart != r.StartDate || originalEnd != r.EndDate)
                {
                    desc = u.Name + " has updated request " + r.Id + ".";
                    var n = _notificationRepo.Create(new NotificationEntity
                    {
                        RequestId = r.Id,
                        Description = desc
                    });
                    if (u.SupervisorId == null)
                    {
                        n.NotifyUserId = u.Id;
                    }
                    else
                    {
                        n.NotifyUserId = (int)u.SupervisorId;
                    }
                }
                else if (r.ApprovedById != null)
                {
                    desc = "Request number " + r.Id + " has been approved.";

                    _notificationRepo.Create(new NotificationEntity
                    {
                        RequestId = r.Id,
                        NotifyUserId = u.Id,
                        Description = desc
                    });
                }

                _unitOfWork.SaveChanges();

                return r.Map<Domain.Shared.Models.Request>();
            }
            catch (Exception ex)
            {
                return BadRequest("Request could not be updated with the provided information.\n " + ex.Message);
            }
        }

        /// <summary>
        /// Deletes a request
        /// </summary>
        /// <param name="id">The request id to delete.</param>
        /// <returns></returns>
        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {

            try
            {
                _reqRepo.Delete(id);
                _unitOfWork.SaveChanges();
                return Ok();
            }
            catch (Exception ex)
            {
                return NotFound($"Could not delete request with id = {id}.\n{ex.Message}");
            }
        }
    }
}