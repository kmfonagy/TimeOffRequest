using System;
namespace TimeOff.Request.Domain.Shared.Models
{
    public class UserRegister
    {
        public string Name { get; set; }

        public string Email { get; set; }

        public string Password { get; set; }

        public string ConfirmPassword { get; set; }
    }
}
