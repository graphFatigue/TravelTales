using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TravelTales.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddedVisitedPlaces : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "blogger_visited_cities",
                columns: table => new
                {
                    BloggerId = table.Column<long>(type: "bigint", nullable: false),
                    VisitedCitiesId = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_blogger_visited_cities", x => new { x.BloggerId, x.VisitedCitiesId });
                    table.ForeignKey(
                        name: "FK_blogger_visited_cities_bloggers_BloggerId",
                        column: x => x.BloggerId,
                        principalTable: "bloggers",
                        principalColumn: "blogger_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_blogger_visited_cities_cities_VisitedCitiesId",
                        column: x => x.VisitedCitiesId,
                        principalTable: "cities",
                        principalColumn: "city_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "blogger_visited_countries",
                columns: table => new
                {
                    BloggerId = table.Column<long>(type: "bigint", nullable: false),
                    VisitedCountriesId = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_blogger_visited_countries", x => new { x.BloggerId, x.VisitedCountriesId });
                    table.ForeignKey(
                        name: "FK_blogger_visited_countries_bloggers_BloggerId",
                        column: x => x.BloggerId,
                        principalTable: "bloggers",
                        principalColumn: "blogger_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_blogger_visited_countries_countries_VisitedCountriesId",
                        column: x => x.VisitedCountriesId,
                        principalTable: "countries",
                        principalColumn: "country_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_blogger_visited_cities_VisitedCitiesId",
                table: "blogger_visited_cities",
                column: "VisitedCitiesId");

            migrationBuilder.CreateIndex(
                name: "IX_blogger_visited_countries_VisitedCountriesId",
                table: "blogger_visited_countries",
                column: "VisitedCountriesId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "blogger_visited_cities");

            migrationBuilder.DropTable(
                name: "blogger_visited_countries");
        }
    }
}
