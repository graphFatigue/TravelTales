using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TravelTales.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class FixBudgetTypeConversion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "budget_level",
                table: "posts",
                type: "int",
                nullable: true,
                defaultValue: 4,
                oldClrType: typeof(string),
                oldType: "integer",
                oldNullable: true,
                oldDefaultValue: "NotSpecified");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "budget_level",
                table: "posts",
                type: "integer",
                nullable: true,
                defaultValue: "NotSpecified",
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true,
                oldDefaultValue: 4);
        }
    }
}
