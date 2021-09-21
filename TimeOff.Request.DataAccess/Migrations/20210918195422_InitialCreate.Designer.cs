﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using TimeOff.Request.DataAccess;

namespace TimeOff.Request.DataAccess.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20210918195422_InitialCreate")]
    partial class InitialCreate
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "5.0.10");

            modelBuilder.Entity("TimeOff.Request.Domain.Shared.Entities.UserEntity", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<bool>("Disabled")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Name")
                        .HasColumnType("TEXT");

                    b.Property<string>("Role")
                        .HasColumnType("TEXT");

                    b.Property<int?>("SupervisorId")
                        .HasColumnType("INTEGER");

                    b.Property<DateTimeOffset>("UserCreated")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("SupervisorId");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("TimeOff.Request.Domain.Shared.Entities.UserEntity", b =>
                {
                    b.HasOne("TimeOff.Request.Domain.Shared.Entities.UserEntity", "Supervisor")
                        .WithMany()
                        .HasForeignKey("SupervisorId");

                    b.Navigation("Supervisor");
                });
#pragma warning restore 612, 618
        }
    }
}