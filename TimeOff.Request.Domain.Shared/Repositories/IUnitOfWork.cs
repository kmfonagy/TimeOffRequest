using System;
namespace TimeOff.Request.Domain.Shared.Repositories
{
    public interface IUnitOfWork
    {
        int SaveChanges();
    }
}
