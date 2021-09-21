using System;
using System.Collections.Generic;
using TimeOff.Request.Domain.Shared.Entities;

namespace TimeOff.Request.Domain.Shared.Services
{
    public interface IUserService
    {
        public IEnumerable<UserEntity> ActiveUsers();

        public IEnumerable<UserEntity> SupervisorEmployees(int supervisorId);
    }
}
