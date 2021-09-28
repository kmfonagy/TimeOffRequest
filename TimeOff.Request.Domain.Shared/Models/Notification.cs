using System;
using TimeOff.Request.Domain.Shared.Entities;

namespace TimeOff.Request.Domain.Shared.Models
{
    public class Notification
    {
        public int Id { get; set; }

        public DateTimeOffset CreatedDate { get; set; }

        public int RequestId { get; set; }

        public virtual Request Request { get; set; }

        public int NotifyUserId { get; set; }

        public virtual User NotifyUser { get; set; }

        public string Description { get; set; }

        public bool Read { get; set; }
    }
}
