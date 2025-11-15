import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function PUT(req: Request) {
  try {
    // Verify token first
    const payload = await verifyToken(req);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get data from request body
    const { currentPassword, newPassword, confirmNewPassword } =
      await req.json();
    const errors: ValidationErrorChangePassword = {};

    // Validate required fields
    if (!currentPassword)
      errors.currentPassword = "Current password is required";
    if (!newPassword) errors.newPassword = "New password is required";
    if (!confirmNewPassword)
      errors.confirmNewPassword = "Confirm password is required";

    // Password validations
    // Check password strength (uppercase, lowercase, digit, special char)
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;

    if (newPassword && !passwordRegex.test(newPassword)) {
      errors.newPassword =
        "Password must include at least 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special symbol";
    }

    if (newPassword && newPassword.length < 8) {
      errors.newPassword = "Password is too short";
    }

    if (
      newPassword &&
      confirmNewPassword &&
      newPassword !== confirmNewPassword
    ) {
      errors.confirmNewPassword = "Passwords do not match";
    }

    // If there are any validation errors, return them all
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    // Get user from database
    const user = await prisma.users.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify current password
    const isValidCurrentPassword = await bcrypt.compare(
      currentPassword,
      user.passwordHash
    );

    if (!isValidCurrentPassword) {
      return NextResponse.json(
        { errors: { currentPassword: "Current password is incorrect" } },
        { status: 400 }
      );
    }

    const isValidNewPassword = await bcrypt.compare(
      newPassword,
      user.passwordHash
    );

    if (isValidNewPassword) {
      return NextResponse.json(
        {
          errors: {
            newPassword:
              "Your new password is the same as your previous password.",
          },
        },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password in database
    await prisma.users.update({
      where: { id: payload.userId },
      data: { passwordHash: hashedNewPassword },
    });

    return NextResponse.json(
      { message: "Password changed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { error: "Failed to change password" },
      { status: 500 }
    );
  }
}
