﻿using System;
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
        public DbSet<NotificationEntity> Notifications { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder) {

            modelBuilder.Entity<UserEntity>()
                .HasKey(u => u.Id);

            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<NotificationEntity>()
                .HasKey(n => n.Id);

            base.OnModelCreating(modelBuilder);
        }
    }
}
