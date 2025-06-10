using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TravelTales.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class FixRelationships : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_notifications_likes_LikedPostId_LikedBloggerId",
                table: "notifications");

            migrationBuilder.DropIndex(
                name: "IX_notifications_LikedPostId_LikedBloggerId",
                table: "notifications");

            migrationBuilder.DropPrimaryKey(
                name: "PK_likes",
                table: "likes");

            migrationBuilder.AddColumn<long>(
                name: "LikeId",
                table: "notifications",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "like_id",
                table: "likes",
                type: "bigint",
                nullable: false,
                defaultValue: 0L)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddPrimaryKey(
                name: "PK_likes",
                table: "likes",
                column: "like_id");

            migrationBuilder.CreateIndex(
                name: "IX_notifications_LikeId",
                table: "notifications",
                column: "LikeId",
                unique: true,
                filter: "[LikeId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_likes_blogger_id",
                table: "likes",
                column: "blogger_id");

            migrationBuilder.AddForeignKey(
                name: "FK_notifications_likes_LikeId",
                table: "notifications",
                column: "LikeId",
                principalTable: "likes",
                principalColumn: "like_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_notifications_likes_LikeId",
                table: "notifications");

            migrationBuilder.DropIndex(
                name: "IX_notifications_LikeId",
                table: "notifications");

            migrationBuilder.DropPrimaryKey(
                name: "PK_likes",
                table: "likes");

            migrationBuilder.DropIndex(
                name: "IX_likes_blogger_id",
                table: "likes");

            migrationBuilder.DropColumn(
                name: "LikeId",
                table: "notifications");

            migrationBuilder.DropColumn(
                name: "like_id",
                table: "likes");

            migrationBuilder.AddPrimaryKey(
                name: "PK_likes",
                table: "likes",
                columns: new[] { "blogger_id", "post_id" });

            migrationBuilder.CreateIndex(
                name: "IX_notifications_LikedPostId_LikedBloggerId",
                table: "notifications",
                columns: new[] { "LikedPostId", "LikedBloggerId" },
                unique: true,
                filter: "[LikedPostId] IS NOT NULL AND [LikedBloggerId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_notifications_likes_LikedPostId_LikedBloggerId",
                table: "notifications",
                columns: new[] { "LikedPostId", "LikedBloggerId" },
                principalTable: "likes",
                principalColumns: new[] { "blogger_id", "post_id" },
                onDelete: ReferentialAction.Cascade);
        }
    }
}
