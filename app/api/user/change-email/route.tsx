import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getUserFromToken, generateVerificationToken } from "@/lib/auth";
import { sendEmailChangeVerification } from "@/lib/email";

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

    const { newEmail } = await request.json();

    // Check if email is already taken
    const existing = await prisma.user.findUnique({
      where: { email: newEmail },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      );
    }

    // Generate verification token
    const verificationToken = generateVerificationToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Create verification record
    await prisma.emailVerification.create({
      data: {
        email: user.email,
        newEmail,
        token: verificationToken,
        type: "change",
        expiresAt,
      },
    });

    // Send verification email
    await sendEmailChangeVerification(user.email, newEmail, verificationToken);

    return NextResponse.json({
      success: true,
      message: "Verification email sent to your new email address",
    });
  } catch (error) {
    console.error("Email change error:", error);
    return NextResponse.json(
      { error: "Failed to change email" },
      { status: 500 }
    );
  }
}
