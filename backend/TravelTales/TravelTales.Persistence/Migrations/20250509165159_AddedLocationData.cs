using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TravelTales.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddedLocationData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "CityId",
                table: "posts",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "CountryId",
                table: "posts",
                type: "bigint",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "countries",
                columns: table => new
                {
                    country_id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Iso2 = table.Column<string>(type: "nvarchar(2)", maxLength: 2, nullable: false),
                    Iso3 = table.Column<string>(type: "nvarchar(3)", maxLength: 3, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_countries", x => x.country_id);
                });

            migrationBuilder.CreateTable(
                name: "cities",
                columns: table => new
                {
                    city_id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    CountryId = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_cities", x => x.city_id);
                    table.ForeignKey(
                        name: "FK_cities_countries_CountryId",
                        column: x => x.CountryId,
                        principalTable: "countries",
                        principalColumn: "country_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_posts_CityId",
                table: "posts",
                column: "CityId");

            migrationBuilder.CreateIndex(
                name: "IX_posts_CountryId",
                table: "posts",
                column: "CountryId");

            migrationBuilder.CreateIndex(
                name: "IX_cities_CountryId",
                table: "cities",
                column: "CountryId");

            migrationBuilder.AddForeignKey(
                name: "FK_posts_cities_CityId",
                table: "posts",
                column: "CityId",
                principalTable: "cities",
                principalColumn: "city_id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_posts_countries_CountryId",
                table: "posts",
                column: "CountryId",
                principalTable: "countries",
                principalColumn: "country_id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_posts_cities_CityId",
                table: "posts");

            migrationBuilder.DropForeignKey(
                name: "FK_posts_countries_CountryId",
                table: "posts");

            migrationBuilder.DropTable(
                name: "cities");

            migrationBuilder.DropTable(
                name: "countries");

            migrationBuilder.DropIndex(
                name: "IX_posts_CityId",
                table: "posts");

            migrationBuilder.DropIndex(
                name: "IX_posts_CountryId",
                table: "posts");

            migrationBuilder.DropColumn(
                name: "CityId",
                table: "posts");

            migrationBuilder.DropColumn(
                name: "CountryId",
                table: "posts");
        }
    }
}
