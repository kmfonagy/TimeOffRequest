using System.Linq;

namespace TimeOff.Request.Domain.Shared.Repositories
{
    public interface IRepositoryComposite<TEntity, TParentId, TId>
    {
        IQueryable<TEntity> Get(TParentId parentId);

        TEntity Get(TParentId parentId, TId id);

        TEntity Create(TEntity entity);

        TEntity Update(TParentId parentId, TId id, TEntity entity);

        void Delete(TParentId parentId, TId id);

        int SaveChanges();
    }
}
