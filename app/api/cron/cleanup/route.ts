import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // Get post IDs that are bookmarked
    const bookmarkedPostIds = await prisma.bookmark.findMany({
      select: { postId: true },
      distinct: ["postId"],
    });

    const bookmarkedIds = bookmarkedPostIds.map(
      (b: { postId: any }) => b.postId
    );

    // Delete posts older than 1 week that are NOT bookmarked
    const result = await prisma.post.deleteMany({
      where: {
        scrapedAt: { lt: oneWeekAgo },
        id: { notIn: bookmarkedIds },
      },
    });

    console.log(`Cleaned up ${result.count} old posts`);

    // Also clean up expired verification tokens
    await prisma.emailVerification.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });

    // Clean up expired sessions
    await prisma.session.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });

    return NextResponse.json({
      success: true,
      deletedPosts: result.count,
      message: "Cleanup completed successfully",
    });
  } catch (error) {
    console.error("Cleanup error:", error);
    return NextResponse.json({ error: "Cleanup failed" }, { status: 500 });
  }
}
