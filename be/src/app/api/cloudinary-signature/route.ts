import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import cloudinary from "@/config/cloudinary";

export async function GET(req: Request) {
  try {
    // Xác thực user
    const payload = verifyToken(req);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Tạo timestamp
    const timestamp = Math.round(new Date().getTime() / 1000);

    // Tạo chữ ký
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder: "avatars", // Optional: folder lưu ảnh trên Cloudinary
      },
      process.env.CLOUDINARY_API_SECRET!
    );

    return NextResponse.json({
      signature,
      timestamp,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
    });
  } catch (error) {
    console.error("Generate signature error:", error);
    return NextResponse.json({ error: "Failed to generate signature" }, { status: 500 });
  }
}