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
    [Route("[controller]")]
    public class UserController : Controller
    {
        private readonly IUserRepository _userRepo;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserService _userService;

        public UserController(IUserRepository userRepo, IUnitOfWork unitOfWork, IUserService userService) {
            this._userRepo = userRepo;
            this._unitOfWork = unitOfWork;
            this._userService = userService;
        }

        /// <summary>
        /// Gets all the users
        /// </summary>
        /// <returns>A list of users</returns>
        [HttpGet]
        public ActionResult<IEnumerable<User>> Get() {

            try {
                return _userRepo.Get().Select(u => u.Map<User>()).ToList();
            }
            catch (Exception ex) {
                return NotFound(ex.Message);
            }
        }

        /// <summary>
        /// Gets all active users.
        /// </summary>
        /// <returns>A list of active users</returns>
        [HttpGet("Active")]
        public ActionResult<IEnumerable<User>> GetActiveUsers() {

            try {
                return _userService.ActiveUsers().Select(u => u.Map<User>()).ToList();
            }
            catch (Exception ex) {
                return NotFound(ex.Message);
            }
        }

		/// <summary>
		/// Gets a specific user
		/// </summary>
		/// <param name="id">The user id to retrieve</param>
		/// <returns>A specific user</returns>
		[HttpGet("{id}")]
		public ActionResult<User> Get(int id) {

			try {
				return _userRepo.Get(id).Map<User>();
			}
			catch (Exception ex) {
				return NotFound($"User with id={id} was not found.\n {ex.Message}");
			}
		}

		/// <summary>
		/// Gets the users that belong to a specific supervisor
		/// </summary>
		/// <param name="supervisorId">The supervisor id</param>
		/// <returns>A list of users</returns>
		[HttpGet("Supervisor/{supervisorId}")]
		public ActionResult<IEnumerable<User>> GetSupervisorEmployees(int supervisorId) {

			try {
				return _userService.SupervisorEmployees(supervisorId).Select(u => u.Map<User>()).ToList();
			}
			catch (Exception ex) {
				return NotFound($"Supervisor with id={supervisorId} was not found.\n {ex.Message}");
			}
		}

		/// <summary>
		/// Adds a user
		/// </summary>
		/// <param name="user">The user to be added</param>
		/// <returns>The user that was added</returns>
		[HttpPost]
		public ActionResult<User> Post([FromBody] User user) {

			try {
				user.DateCreated = DateTimeOffset.Now;

				var u = _userRepo.Create(user.Map<UserEntity>());

				_unitOfWork.SaveChanges();

				return u.Map<User>();
			}
			catch (Exception ex) {
				return BadRequest("User could not be created with the provided parameters.\n " + ex.Message);
			}
		}

		/// <summary>
		/// Updates a user
		/// </summary>
		/// <param name="id">The user id that needs to be updated</param>
		/// <param name="updatedUser">The user to be updated</param>
		/// <returns>The user that was updated.</returns>
		[HttpPut("{id}")]
		public ActionResult<User> Put(int id, [FromBody] User updatedUser) {

			try {
				UserEntity u = _userRepo.Update(id, updatedUser.Map<UserEntity>());

				_unitOfWork.SaveChanges();

				return u.Map<User>();
			}
			catch (Exception ex) {
				return BadRequest("User could not be updated with the provided information.\n " + ex.Message);
			}
		}

		/// <summary>
		/// Deletes a user
		/// </summary>
		/// <param name="id">The user id to delete.</param>
		/// <returns></returns>
		[HttpDelete("{id}")]
		public ActionResult Delete(int id) {

			try {
				_userRepo.Delete(id);
				_unitOfWork.SaveChanges();
				return Ok();
			}
			catch (Exception ex) {
				return NotFound($"Could not delete user with id = {id}.\n{ex.Message}");
			}
		}
	}
}
