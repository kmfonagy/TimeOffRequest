using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace TimeOff.Request.DataAccess.Migrations
{
    public partial class UpdatedUserEntity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "UserCreated",
                table: "Users",
                newName: "LastLogin");

            migrationBuilder.RenameColumn(
                name: "Role",
                table: "Users",
                newName: "Salt");

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "DateCreated",
                table: "Users",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)));

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Users",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Hash",
                table: "Users",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<float>(
                name: "NumberOfDaysOff",
                table: "Users",
                type: "REAL",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<string>(
                name: "PasswordResetToken",
                table: "Users",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "RequiresPasswordReset",
                table: "Users",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Roles",
                table: "Users",
                type: "TEXT",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DateCreated",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Hash",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "NumberOfDaysOff",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "PasswordResetToken",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "RequiresPasswordReset",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Roles",
                table: "Users");

            migrationBuilder.RenameColumn(
                name: "Salt",
                table: "Users",
                newName: "Role");

            migrationBuilder.RenameColumn(
                name: "LastLogin",
                table: "Users",
                newName: "UserCreated");
        }
    }
}
