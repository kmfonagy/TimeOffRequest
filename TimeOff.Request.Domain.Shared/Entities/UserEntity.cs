using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace TimeOff.Request.Domain.Shared.Entities
{
    public class UserEntity
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Email { get; set; }

        public DateTimeOffset DateCreated { get; set; }

        public int? SupervisorId { get; set; }

        [ForeignKey("SupervisorId")]
        public virtual UserEntity Supervisor { get; set; }

        public float NumberOfDaysOff { get; set; }

        public string Roles { get; set; }

        public string Salt { get; set; }

        public string Hash { get; set; }

        public string PasswordResetToken { get; set; }

        public bool RequiresPasswordReset { get; set; }

        public DateTimeOffset LastLogin { get; set; }

        public bool Disabled { get; set; }
    }
}
