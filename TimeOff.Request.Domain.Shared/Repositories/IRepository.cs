using System.Linq;

namespace TimeOff.Request.Domain.Shared.Repositories
{
    public interface IRepository<TEntity, TId>
    {
        IQueryable<TEntity> Get();

        TEntity Get(TId id);

        TEntity Create(TEntity entity);

        TEntity Update(TId id, TEntity entity);

        void Delete(TId id);
    }

    public interface IRepository<TEntity>
    {
        IQueryable<TEntity> Get();

        TEntity Create(TEntity entity);

        void Delete(TEntity entity);
    }
}
