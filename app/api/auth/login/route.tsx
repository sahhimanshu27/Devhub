import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyPassword, createSession } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const req = await request.formData();
    const emailEntry = req.get("email");
    const passwordEntry = req.get("password");
    const password = typeof passwordEntry === "string" ? passwordEntry : "";
    const email = typeof emailEntry === "string" ? emailEntry : "";

    console.log("Login attempt:", { email, password });

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // // Check email verification
    // if (!user.emailVerified) {
    //   return NextResponse.json(
    //     {
    //       error: "Please verify your email before logging in",
    //       needsVerification: true,
    //     },
    //     { status: 403 }
    //   );
    // }

    // Create session
    const token = await createSession(user.id);

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
