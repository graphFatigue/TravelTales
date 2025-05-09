using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TravelTales.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddedFollowFunctionality : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "blogger_follows",
                columns: table => new
                {
                    blogger_follow_id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FollowerId = table.Column<long>(type: "bigint", nullable: false),
                    FollowingId = table.Column<long>(type: "bigint", nullable: false),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: true),
                    modified_at = table.Column<DateTime>(type: "datetime2", nullable: true),
                    is_deleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_blogger_follows", x => x.blogger_follow_id);
                    table.ForeignKey(
                        name: "FK_blogger_follows_bloggers_FollowerId",
                        column: x => x.FollowerId,
                        principalTable: "bloggers",
                        principalColumn: "blogger_id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_blogger_follows_bloggers_FollowingId",
                        column: x => x.FollowingId,
                        principalTable: "bloggers",
                        principalColumn: "blogger_id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_blogger_follows_FollowerId",
                table: "blogger_follows",
                column: "FollowerId");

            migrationBuilder.CreateIndex(
                name: "IX_blogger_follows_FollowingId",
                table: "blogger_follows",
                column: "FollowingId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "blogger_follows");
        }
    }
}
