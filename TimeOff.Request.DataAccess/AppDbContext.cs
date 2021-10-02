using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using TimeOff.Request.Domain.Shared.Entities;

namespace TimeOff.Request.DataAccess
{
    public class AppDbContext :DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<UserEntity> Users { get; set; }

        public DbSet<RequestEntity> Requests { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder) {

            modelBuilder.Entity<UserEntity>()
                .HasKey(u => u.Id);
            modelBuilder.Entity<RequestEntity>()
                .HasKey(r => r.Id);

            base.OnModelCreating(modelBuilder);
        }
    }
}
