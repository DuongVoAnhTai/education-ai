import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const generic = {
      message: "Đã gửi liên kết đặt lại mật khẩu.",
    };

    if (!email) {
      return NextResponse.json(
        { errors: { email: "Email is required" } },
        { status: 400 }
      );
    }

    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ message: generic }, { status: 200 });

    // Tạo token ngẫu nhiên và hash
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = await bcrypt.hash(rawToken, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10m

    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${rawToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    // Gửi email qua SendPulse API
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: "Yêu Cầu Đặt Lại Mật Khẩu",
      html: `
        <p>Chào ${user.fullName},</p>
        <p>Bạn đã yêu cầu đặt lại mật khẩu. Nhấn vào liên kết bên dưới để tiếp tục:</p>
        <p><a href="${resetUrl}" target="_blank">Đặt Lại Mật Khẩu</a></p>
        <p>Liên kết này sẽ hết hạn sau 10 phút.</p>
        <p>Nếu bạn không yêu cầu điều này, vui lòng bỏ qua email này.</p>
      `,
    });

    return NextResponse.json({ message: generic }, { status: 200 });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
