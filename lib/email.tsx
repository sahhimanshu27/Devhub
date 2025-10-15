import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || "noreply@devhub.com",
    to: email,
    subject: "Verify your DevHub account",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #8b5cf6;">Welcome to DevHub!</h2>
        <p>Please verify your email address by clicking the button below:</p>
        <a href="${verificationUrl}" 
           style="display: inline-block; background: #8b5cf6; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 8px; margin: 20px 0;">
          Verify Email
        </a>
        <p style="color: #666; font-size: 14px;">
          This link will expire in 24 hours. If you didn't create this account, please ignore this email.
        </p>
      </div>
    `,
  });
}

export async function sendEmailChangeVerification(
  email: string,
  newEmail: string,
  token: string
) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email-change?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || "noreply@devhub.com",
    to: newEmail,
    subject: "Verify your new email address",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #8b5cf6;">Email Change Request</h2>
        <p>You requested to change your email from <strong>${email}</strong> to <strong>${newEmail}</strong>.</p>
        <p>Please verify your new email address by clicking the button below:</p>
        <a href="${verificationUrl}" 
           style="display: inline-block; background: #8b5cf6; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 8px; margin: 20px 0;">
          Verify New Email
        </a>
        <p style="color: #666; font-size: 14px;">
          This link will expire in 24 hours.
        </p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || "noreply@devhub.com",
    to: email,
    subject: "Reset your DevHub password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #8b5cf6;">Password Reset Request</h2>
        <p>Click the button below to reset your password:</p>
        <a href="${resetUrl}" 
           style="display: inline-block; background: #8b5cf6; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 8px; margin: 20px 0;">
          Reset Password
        </a>
        <p style="color: #666; font-size: 14px;">
          This link will expire in 1 hour. If you didn't request this, please ignore this email.
        </p>
      </div>
    `,
  });
}
