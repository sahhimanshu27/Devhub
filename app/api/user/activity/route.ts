import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getUserFromToken } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserFromToken(token);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { activityType, platform, keyword, postUrl } = await request.json();

    await prisma.userActivity.create({
      data: {
        userId: user.id,
        activityType,
        platform,
        keyword,
        postUrl,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Activity tracking error:", error);
    return NextResponse.json(
      { error: "Failed to track activity" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserFromToken(token);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get platform statistics
    const platformStats = await prisma.userActivity.groupBy({
      by: ["platform"],
      where: {
        userId: user.id,
        platform: { not: null },
      },
      _count: true,
    });

    // Get keyword statistics
    const keywordStats = await prisma.userActivity.groupBy({
      by: ["keyword"],
      where: {
        userId: user.id,
        keyword: { not: null },
      },
      _count: true,
      orderBy: {
        _count: {
          keyword: "desc",
        },
      },
      take: 20,
    });

    // Get recent activities
    const recentActivities = await prisma.userActivity.findMany({
      where: { userId: user.id },
      orderBy: { timestamp: "desc" },
      take: 50,
    });

    return NextResponse.json({
      platforms: platformStats,
      keywords: keywordStats,
      recent: recentActivities,
    });
  } catch (error) {
    console.error("Activity fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 }
    );
  }
}
