using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using TimeOff.Request.DataAccess;
using TimeOff.Request.Domain.Shared.Entities;
using TimeOff.Request.Domain.Shared.Repositories;

namespace TimeOff.Request.Domain.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _db;

        public UserRepository(AppDbContext db)
        {
            this._db = db;
        }

        public IQueryable<UserEntity> Get() {

            return _db.Users
                .Include(u => u.Supervisor);
        }

        public UserEntity Get(int id) {
            var u = _db.Users
                .Include(u => u.Supervisor)
                .FirstOrDefault(u => u.Id == id);

            if (u == null) {
                throw new Exception($"User with id: {id} does not exist.");
            }

            return u;
        }

        public UserEntity Create(UserEntity entity) {
            var user = _db.Users.Where(u => u.Name == entity.Name);

            if (user.Count() > 0) {
                throw new Exception("User already exists.");
            }

            return _db.Users.Add(entity).Entity;
        }

        public UserEntity Update(int id, UserEntity entity) {
            var user = _db.Users.Include(u => u.Supervisor).FirstOrDefault(u => u.Id == id);

            if (user == null) {
                throw new Exception("User does not exist.");
            }

            if (_db.Users.Where(u => u.Name == entity.Name && u.Id != entity.Id).Count() > 0) {
                throw new Exception("User already exists.");
            }

            _db.Entry(user).CurrentValues.SetValues(entity);

            return user;
        }

        public void Delete(int id) {
            var user = _db.Users.FirstOrDefault(u => u.Id == id);

            if (user == null) {
                throw new Exception("User does not exist.");
            }

            user.Disabled = true;
        }
    }
}
