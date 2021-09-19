using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using TimeOff.Request.DataAccess;
using TimeOff.Request.Domain.Shared.Entities;
using TimeOff.Request.Domain.Shared.Repositories;
using TimeOff.Request.Domain.Shared.Services;

namespace TimeOff.Request.Domain.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepo;
        private readonly AppDbContext _db;

        public UserService(IUserRepository userRepo, AppDbContext db) {
            this._userRepo = userRepo;
            this._db = db;
        }

        public IEnumerable<UserEntity> ActiveUsers() {
            return _userRepo.Get()
                .Include(u => u.Supervisor)
                .Where(u => !u.Disabled);
        }

        public IEnumerable<UserEntity> SupervisorEmployees(int supervisorId) {
            var supervisor = _db.Users.FirstOrDefault(u => u.Id == supervisorId);

            if (supervisor == null) {
                throw new Exception("Couldn't find supervisor.");
            }

            return _userRepo.Get()
                .Include(u => u.Supervisor)
                .Where(u => u.SupervisorId == supervisorId);
        }
    }
}
