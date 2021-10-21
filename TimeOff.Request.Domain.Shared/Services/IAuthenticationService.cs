using System;
using TimeOff.Request.Domain.Shared.Models;

namespace TimeOff.Request.Domain.Shared.Services
{
    public interface IAuthenticationService
    {
        User Authenticate(UserLogin login);

        void ResetPassword(UserPasswordReset resetPassword);

        User Register(UserRegister userRegister);
    }
}
