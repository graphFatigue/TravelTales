using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TravelTales.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddedBlockBlogger : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "blogger_blocks",
                columns: table => new
                {
                    blocker_id = table.Column<long>(type: "bigint", nullable: false),
                    blocked_id = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_blogger_blocks", x => new { x.blocker_id, x.blocked_id });
                    table.ForeignKey(
                        name: "FK_blogger_blocks_bloggers_blocked_id",
                        column: x => x.blocked_id,
                        principalTable: "bloggers",
                        principalColumn: "blogger_id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_blogger_blocks_bloggers_blocker_id",
                        column: x => x.blocker_id,
                        principalTable: "bloggers",
                        principalColumn: "blogger_id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_blogger_blocks_blocked_id",
                table: "blogger_blocks",
                column: "blocked_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "blogger_blocks");
        }
    }
}
