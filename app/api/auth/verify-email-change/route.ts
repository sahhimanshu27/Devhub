import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    const verification = await prisma.emailVerification.findUnique({
      where: { token },
    });

    if (
      !verification ||
      verification.expiresAt < new Date() ||
      verification.type !== "change"
    ) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // Update user email
    await prisma.user.update({
      where: { email: verification.email },
      data: { email: verification.newEmail! },
    });

    // Delete verification record
    await prisma.emailVerification.delete({ where: { token } });

    return NextResponse.json({
      success: true,
      message: "Email changed successfully!",
    });
  } catch (error) {
    console.error("Email change verification error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
