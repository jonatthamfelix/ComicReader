using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ComicReader.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddReadingProgress : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "LastPageNumber",
                table: "Comics",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastReadAt",
                table: "Comics",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LastPageNumber",
                table: "Comics");

            migrationBuilder.DropColumn(
                name: "LastReadAt",
                table: "Comics");
        }
    }
}
