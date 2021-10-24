using System;
using System.Linq;
using TimeOff.Request.DataAccess;
using TimeOff.Request.Domain.Shared.Models;
using TimeOff.Request.Domain.Shared.Services;

namespace TimeOff.Request.Domain.Services
{
    public class AuthenticationService : IAuthenticationService
    {
        private readonly AppDbContext _db;

        public AuthenticationService(AppDbContext db) {
            this._db = db;
        }

        public User Authenticate(UserLogin login) {

            var user = _db.Users.FirstOrDefault(u => u.Email == login.Email);

            if (user != null && user.ValidatePassword(login.Password) && !user.RequiresPasswordReset) {

                var authenticatedUser = new User() {
                    Id = user.Id,
                    Email = user.Email,
                    Name = user.Name,
                    Roles = user.Roles
                };

                user.LastLogin = DateTime.Now;
                _db.SaveChanges();

                return authenticatedUser;
            }

            return null;
        }

        public User Register(UserRegister userRegister) {
            var user = _db.Users.Where(u => u.Email == userRegister.Email).FirstOrDefault();

            if (user == null) {
                throw new Exception("User doesn't exist.");
            }

            if (userRegister.Password != userRegister.ConfirmPassword) {
                throw new Exception("Password validation failed.");
            }

            user.SetPassword(userRegister.Password);

            _db.SaveChanges();

            return Authenticate(new UserLogin() {
                Email = user.Email,
                Password = userRegister.Password
            });
        }

        public void ResetPassword(UserPasswordReset resetPassword) {

            var user = _db.Users.Where(u => u.Email == resetPassword.Email ).FirstOrDefault();

            if (user == null) {
                throw new Exception("Invalid user email.");
            }

            if (resetPassword.Password != resetPassword.ConfirmPassword) {
                throw new Exception("Password validation failed.");
            }

            user.SetPassword(resetPassword.Password);
            user.RequiresPasswordReset = false;
            user.PasswordResetToken = "";

            _db.SaveChanges();
        }
    }
}
