using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TravelTales.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddedLocationDataToBlogger : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "CityId",
                table: "bloggers",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "CountryId",
                table: "bloggers",
                type: "bigint",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_bloggers_CityId",
                table: "bloggers",
                column: "CityId");

            migrationBuilder.CreateIndex(
                name: "IX_bloggers_CountryId",
                table: "bloggers",
                column: "CountryId");

            migrationBuilder.AddForeignKey(
                name: "FK_bloggers_cities_CityId",
                table: "bloggers",
                column: "CityId",
                principalTable: "cities",
                principalColumn: "city_id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_bloggers_countries_CountryId",
                table: "bloggers",
                column: "CountryId",
                principalTable: "countries",
                principalColumn: "country_id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_bloggers_cities_CityId",
                table: "bloggers");

            migrationBuilder.DropForeignKey(
                name: "FK_bloggers_countries_CountryId",
                table: "bloggers");

            migrationBuilder.DropIndex(
                name: "IX_bloggers_CityId",
                table: "bloggers");

            migrationBuilder.DropIndex(
                name: "IX_bloggers_CountryId",
                table: "bloggers");

            migrationBuilder.DropColumn(
                name: "CityId",
                table: "bloggers");

            migrationBuilder.DropColumn(
                name: "CountryId",
                table: "bloggers");
        }
    }
}
