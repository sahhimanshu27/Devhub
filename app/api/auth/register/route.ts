import { NextResponse } from "next/server";
import { PrismaClient } from ".prisma/client";
import { hashPassword, generateVerificationToken } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/email";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const req = await request.formData();
    const emailEntry = req.get("email");
    const passwordEntry = req.get("password");
    const password = typeof passwordEntry === "string" ? passwordEntry : "";
    const email = typeof emailEntry === "string" ? emailEntry : "";

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (typeof password === "string" && password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password); // password is now guaranteed to be a string

    // Generate verification token
    const verificationToken = generateVerificationToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        verificationToken,
      },
    });

    // // Create verification record
    // await prisma.emailVerification.create({
    //   data: {
    //     email,
    //     token: verificationToken,
    //     type: "verify",
    //     expiresAt,
    //   },
    // });

    // // Send verification email
    // await sendVerificationEmail(email, verificationToken);

    return NextResponse.json({
      success: true,
      message:
        "Account created! Please check your email to verify your account.",
      userId: user.id,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
