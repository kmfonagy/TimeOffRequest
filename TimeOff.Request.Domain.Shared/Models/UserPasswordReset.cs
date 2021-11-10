using System;
namespace TimeOff.Request.Domain.Shared.Models
{
    public class UserPasswordReset
    {
        public int Id { get; set; }

        public string Password { get; set; }

        public string ConfirmPassword { get; set; }

        public string Email { get; set; }
    }
}
