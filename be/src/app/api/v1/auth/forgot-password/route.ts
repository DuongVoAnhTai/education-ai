import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/sendpulseApi";

const FRONTEND_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const errors: { [key: string]: string } = {};

    const generic = {
      message: "Đã gửi liên kết đặt lại mật khẩu.",
    };

    if (!email) errors.email = "Email is required";

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) return NextResponse.json(generic);

    // Xóa các token cũ chưa dùng của user này
    await prisma.passwordReset.deleteMany({
      where: {
        userId: user.id,
        used: false,
      },
    });

    // Tạo token ngẫu nhiên và hash
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1h

    await prisma.passwordReset.create({
      data: {
        tokenHash,
        expiresAt,
        user: { connect: { id: user.id } },
      },
    });

    const resetLink = `${FRONTEND_URL}/reset-password?token=${rawToken}&id=${user.id}`;

    // Gửi email qua SendPulse API
    await sendEmail({
      to: user.email,
      subject: "Đặt lại mật khẩu của bạn",
      html: `
        <p>Chào ${user.fullName},</p>
        <p>Bạn đã yêu cầu đặt lại mật khẩu. Nhấn vào liên kết bên dưới để tiếp tục:</p>
        <p><a href="${resetLink}" target="_blank">${resetLink}</a></p>
        <p>Liên kết này sẽ hết hạn sau 1 giờ.</p>
      `,
      text: `Reset password link: ${resetLink}`,
    });

    return NextResponse.json(generic);
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
