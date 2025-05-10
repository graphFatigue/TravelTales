using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TravelTales.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddedBudgetToPostEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "budget_level",
                table: "posts",
                type: "integer",
                nullable: true,
                defaultValue: "NotSpecified");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "budget_level",
                table: "posts");
        }
    }
}
