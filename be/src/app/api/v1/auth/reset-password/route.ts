import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { token, password, confirmPassword } = await req.json();
    const errors: { [key: string]: string } = {};

    if (!token) errors.token = "Token is required";
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
    // Vì bcrypt tạo salt ngẫu nhiên, ta không thể tìm trực tiếp bằng hash.
    // Ta phải tìm tất cả các token hợp lệ và so sánh.
    const potentialTokens = await prisma.passwordReset.findMany({
      where: {
        used: false,
        expiresAt: {
          gt: new Date(), // Lớn hơn thời gian hiện tại -> chưa hết hạn
        },
      },
    });

    let matchingTokenRecord = null;
    for (const record of potentialTokens) {
      const isTokenValid = await bcrypt.compare(token, record.tokenHash);
      if (isTokenValid) {
        matchingTokenRecord = record;
        break;
      }
    }

    if (!matchingTokenRecord) {
      return NextResponse.json(
        { errors: { token: "Token không hợp lệ hoặc đã hết hạn." } },
        { status: 400 }
      );
    }

    // Hash mật khẩu mới
    const newPasswordHash = await bcrypt.hash(password, 10);

    await prisma.users.update({
      where: { id: matchingTokenRecord.userId },
      data: { passwordHash: newPasswordHash },
    });

    // Vô hiệu hóa token sau khi sử dụng
    await prisma.passwordReset.update({
      where: { id: matchingTokenRecord.id },
      data: { used: true },
    });

    return NextResponse.json(
      { message: "Password reset successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}
