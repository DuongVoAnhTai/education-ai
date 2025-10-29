import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { token, id, password, confirmPassword } = await req.json();
    const errors: { [key: string]: string } = {};

    if (!token) errors.token = "Token is required";
    if (!id) errors.id = "User ID is required";
    if (!password) errors.password = "Password is required";
    if (!confirmPassword)
      errors.confirmPassword = "Confirm password is required";

    // Validate password
    if (password) {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;
      if (!passwordRegex.test(password)) {
        errors.password =
          "Password must include uppercase, lowercase, number and special character";
      }
      if (password.length < 8) {
        errors.password = "Password must be at least 8 characters";
      }
      if (password !== confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    // Find valid reset token
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const resetToken = await prisma.passwordReset.findFirst({
      where: {
        tokenHash,
        userId: id,
        expiresAt: { gt: new Date() },
        used: false,
      },
    });

    if (!resetToken) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    // Update password
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.$transaction([
      prisma.users.update({
        where: { id },
        data: { passwordHash: hashedPassword },
      }),
      prisma.passwordReset.update({
        where: { id: resetToken.id },
        data: { used: true },
      }),
    ]);

    // // Delete used token
    // await prisma.passwordReset.delete({
    //   where: { id: resetToken.id },
    // });

    return NextResponse.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}
