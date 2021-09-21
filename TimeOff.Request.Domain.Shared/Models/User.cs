using System;
using TimeOff.Request.Domain.Shared.Entities;

namespace TimeOff.Request.Domain.Shared.Models
{
    public class User
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public DateTimeOffset UserCreated { get; set; }

        public int? SupervisorId { get; set; }

        public virtual User Supervisor { get; set; }

        public string Role { get; set; }

        public bool Disabled { get; set; }
    }
}
