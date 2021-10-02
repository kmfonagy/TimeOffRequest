using System;
using System.Collections.Generic;
using TimeOff.Request.Domain.Shared.Entities;

namespace TimeOff.Request.Domain.Shared.Services
{
    public interface IRequestService
    {
        public IEnumerable<RequestEntity> ActiveRequests();

        public IEnumerable<RequestEntity> CreatedBy(int createdById);

        public IEnumerable<RequestEntity> ApprovedBy(int approvedById);
    }
}
