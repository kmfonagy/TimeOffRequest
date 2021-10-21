using System;
using System.ComponentModel.DataAnnotations;

namespace TimeOff.Request.Domain.Shared.Models
{
    public class UserLogin
    {
        /// <summary>
        /// User email address.
        /// </summary>
        [Required]
        [DataType(DataType.EmailAddress)]
        public string Email { get; set; }

        /// <summary>
        /// Password.
        /// </summary>
        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; }
    }
}
