using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace TimeOff.Request.Domain.Shared.Entities
{
    public class UserEntity
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public DateTimeOffset UserCreated { get; set; }

        public int? SupervisorId { get; set; }

        [ForeignKey("SupervisorId")]
        public virtual UserEntity Supervisor { get; set; }

        public string Role { get; set; }

        public bool Disabled { get; set; }
    }
}
