using System;
using TimeOff.Request.Domain.Shared.Entities;
using TimeOff.Request.Domain.Shared.Models;

namespace TimeOff.Request.Domain.Shared.Services
{
    public interface IAuthenticationService
    {
        UserEntity Authenticate(UserLogin login);

        void ResetPassword(UserPasswordReset resetPassword);

        UserEntity Register(UserRegister userRegister);
    }
}
