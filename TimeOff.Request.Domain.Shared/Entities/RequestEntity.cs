using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace TimeOff.Request.Domain.Shared.Entities
{
    public class RequestEntity
    {
        public int Id { get; set;  }

        public int CreatedById { get; set; }

        [ForeignKey("CreatedById")]
        public virtual UserEntity CreatedBy { get; set; }

        public int? ApprovedById { get; set; }

        [ForeignKey("ApprovedById")]
        public virtual UserEntity ApprovedBy { get; set; }

        public string Description { get; set; }

        public DateTimeOffset CreatedDate { get; set; }

        public DateTimeOffset ApprovedDate { get; set; }

        public DateTimeOffset StartDate { get; set; }

        public DateTimeOffset EndDate { get; set; }

        public float NumberOfDays { get; set; }

        public bool Canceled { get; set; }

        public bool Archived { get; set; }

        public bool Disabled { get; set; }
    }
}
