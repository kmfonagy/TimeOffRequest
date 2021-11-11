using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TimeOff.Request.Domain.Shared.Models;
using TimeOff.Request.Domain.Shared.Repositories;
using TimeOff.Request.Domain.Shared.Services;
using TimeOff.Request.Helpers;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace TimeOff.Request.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthenticationController : Controller
    {
        private readonly IUserRepository _userRepo;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserService _userService;
        private readonly IAuthenticationService authenticationService;

        public AuthenticationController(IUserRepository userRepo,
            IUnitOfWork unitOfWork,
            IUserService userService,
            IAuthenticationService authenticationService) {
            this._userRepo = userRepo;
            this._unitOfWork = unitOfWork;
            this._userService = userService;
            this.authenticationService = authenticationService;
        }

        /// <summary>
        /// Authenticates a user.
        /// </summary>
        /// <param name="login">User name and password.</param>
        /// <returns>Authenticated user.</returns>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public ActionResult<User> Login(UserLogin login) {
            try {
                var user = authenticationService.Authenticate(login);
                if (user != null) {
                    return user.Map<User>();
                }
                else {
                    return BadRequest();
                }
            }
            catch (Exception ex) {
                return BadRequest(new {
                    Message = ex.Message
                });
            }
        }

        /// <summary>
        /// Registers a user
        /// </summary>
        /// <param name="registerUser">User to register that includes a password
        /// and email</param>
        /// <returns>Authenticated user.</returns>
        [HttpPost("register/")]
        public ActionResult<User> Register([FromBody] UserRegister registerUser) {
            try {
                var user = authenticationService.Register(registerUser);
                if (user != null) {
                    return user.Map<User>();
                }
                else {
                    return Unauthorized();
                }
            }
            catch (Exception ex) {
                return BadRequest(new {
                    Message = ex.Message
                });
            }
        }

        /// <summary>
        /// Reset a password
        /// </summary>
        /// <param name="resetPasswordDto">Reset password details</param>
        /// <returns></returns>
        [HttpPost("resetPassword/")]
        public ActionResult ResetPassword([FromBody] UserPasswordReset resetPasswordDto) {
            try {
                authenticationService.ResetPassword(resetPasswordDto);
                return Ok();
            }
            catch (Exception ex) {
                return BadRequest(new {
                    Message = ex.Message
                });
            }
        }
    }
}
