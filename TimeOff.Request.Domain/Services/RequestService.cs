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
    public class RequestService : IRequestService
    {
        private readonly IRequestRepository _reqRepo;
        private readonly AppDbContext _db;

        public RequestService(IRequestRepository repRepo, AppDbContext db)
        {
            this._reqRepo = repRepo;
            this._db = db;
        }

        public IEnumerable<RequestEntity> ActiveRequests()
        {
            return _reqRepo.Get()
                .Include(r => r.ApprovedBy)
                .Where(r => !r.Disabled);
        }

        public IEnumerable<RequestEntity> ApprovedBy(int approvedById)
        {
            var supervisor = _db.Requests.FirstOrDefault(r => r.ApprovedById == approvedById);

            if (supervisor == null)
            {
                throw new Exception("Couldn't find supervisor.");
            }

            return _reqRepo.Get()
                .Include(r => r.ApprovedBy)
                .Where(r => r.ApprovedById == approvedById);
        }

        public IEnumerable<RequestEntity> CreatedBy(int createdById)
        {
            var user = _db.Requests.FirstOrDefault(r => r.CreatedById == createdById);

            if (user == null)
            {
                throw new Exception("Couldn't find supervisor.");
            }

            return _reqRepo.Get()
                .Include(r => r.CreatedBy)
                .Where(r => r.CreatedById == createdById);
        }
    }
}
