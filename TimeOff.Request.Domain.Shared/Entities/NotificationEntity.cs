using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace TimeOff.Request.Domain.Shared.Entities
{
    public class NotificationEntity
    {

        public int Id { get; set; }

        public DateTimeOffset CreatedDate { get; set; }

        public int RequestId { get; set; }

        [ForeignKey("RequestId")]
        public virtual RequestEntity Request { get; set; }

        public int NotifyUserId { get; set; }

        [ForeignKey("NotifyUserId")]
        public virtual UserEntity NotifyUser { get; set; }

        public string Description { get; set; }

        public bool Read { get; set; }
    }
}
