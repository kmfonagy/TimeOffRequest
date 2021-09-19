using System;
using TimeOff.Request.Domain.Shared.Entities;

namespace TimeOff.Request.Domain.Shared.Repositories
{
    public interface IUserRepository : IRepository<UserEntity, int>
    {
    }
}
