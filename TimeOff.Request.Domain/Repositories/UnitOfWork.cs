using System;
using TimeOff.Request.DataAccess;
using TimeOff.Request.Domain.Shared.Repositories;

namespace TimeOff.Request.Domain.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _dataContext;

        public UnitOfWork(AppDbContext dataContext) {
            this._dataContext = dataContext;
        }

        public int SaveChanges() {
            return _dataContext.SaveChanges();
        }
    }
}
