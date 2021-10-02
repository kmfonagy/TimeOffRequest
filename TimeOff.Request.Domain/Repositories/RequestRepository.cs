using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using TimeOff.Request.DataAccess;
using TimeOff.Request.Domain.Shared.Entities;
using TimeOff.Request.Domain.Shared.Repositories;

namespace TimeOff.Request.Domain.Repositories
{
    public class RequestRepository : IRequestRepository
    {
        private readonly AppDbContext _db;

        public RequestRepository(AppDbContext db)
        {
            this._db = db;
        }

        public IQueryable<RequestEntity> Get()
        {
            return _db.Requests
                .Include(r => r.CreatedBy)
                .Include(r => r.ApprovedBy);
        }

        public RequestEntity Get(int id)
        {
            var r = _db.Requests
                .Include(r => r.CreatedBy)
                .Include(r => r.ApprovedBy)
                .FirstOrDefault(r => r.Id == id);

            if (r == null)
            {
                throw new Exception($"Request with id: {id} does not exist.");
            }

            return r;
        }

        public RequestEntity Create(RequestEntity entity)
        {
            var req = _db.Requests.Where(r => r.CreatedById == entity.CreatedById
                && r.StartDate == entity.StartDate
                && r.EndDate == entity.EndDate);

            if (req.Count() > 0)
            {
                throw new Exception("Request already exists.");
            }

            return _db.Requests.Add(entity).Entity;
        }

        public RequestEntity Update(int id, RequestEntity entity)
        {
            var req = _db.Requests
                .Include(r => r.CreatedBy)
                .Include(r => r.ApprovedBy)
                .FirstOrDefault(r => r.Id == id);

            if (req == null)
            {
                throw new Exception("Request does not exist.");
            }

            if (_db.Requests.Where(r => r.CreatedById == entity.CreatedById
                && r.StartDate == entity.StartDate
                && r.EndDate == entity.EndDate
                && r.Id != entity.Id).Count() > 0)
            {
                throw new Exception("Request already exists.");
            }

            _db.Entry(req).CurrentValues.SetValues(entity);

            return req;
        }

        public void Delete(int id)
        {
            var req = _db.Requests.FirstOrDefault(r => r.Id == id);

            if (req == null)
            {
                throw new Exception("Request does not exist.");
            }

            req.Disabled = true;
        }

        public void Archive(int id)
        {
            var req = _db.Requests.FirstOrDefault(r => r.Id == id);

            if (req == null)
            {
                throw new Exception("Request does not exist.");
            }

            req.Archived = true;
        }
    }
}
