import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    // Find verification record
    const verification = await prisma.emailVerification.findUnique({
      where: { token },
    });

    if (!verification || verification.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // Update user
    await prisma.user.update({
      where: { email: verification.email },
      data: {
        emailVerified: true,
        verificationToken: null,
      },
    });

    // Delete verification record
    await prisma.emailVerification.delete({ where: { token } });

    return NextResponse.json({
      success: true,
      message: "Email verified successfully!",
    });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
