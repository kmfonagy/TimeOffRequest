using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace TimeOff.Request.DataAccess.Migrations
{
    public partial class CreatedRequestEntity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Requests",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    CreatedById = table.Column<int>(type: "INTEGER", nullable: false),
                    ApprovedById = table.Column<int>(type: "INTEGER", nullable: true),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedDate = table.Column<DateTimeOffset>(type: "TEXT", nullable: false),
                    ApprovedDate = table.Column<DateTimeOffset>(type: "TEXT", nullable: false),
                    StartDate = table.Column<DateTimeOffset>(type: "TEXT", nullable: false),
                    EndDate = table.Column<DateTimeOffset>(type: "TEXT", nullable: false),
                    NumberOfDays = table.Column<float>(type: "REAL", nullable: false),
                    Canceled = table.Column<bool>(type: "INTEGER", nullable: false),
                    Archived = table.Column<bool>(type: "INTEGER", nullable: false),
                    Disabled = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Requests", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Requests_Users_ApprovedById",
                        column: x => x.ApprovedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Requests_Users_CreatedById",
                        column: x => x.CreatedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Requests_ApprovedById",
                table: "Requests",
                column: "ApprovedById");

            migrationBuilder.CreateIndex(
                name: "IX_Requests_CreatedById",
                table: "Requests",
                column: "CreatedById");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Requests");
        }
    }
}
