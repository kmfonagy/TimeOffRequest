using System;
using System.Linq;
using TimeOff.Request.Domain.Shared.Entities;

namespace TimeOff.Request.Domain.Shared.Repositories
{
    public interface IRequestRepository : IRepository<RequestEntity, int>
    {
    }
}
