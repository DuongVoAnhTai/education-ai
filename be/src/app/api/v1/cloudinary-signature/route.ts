import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import cloudinary from "@/config/cloudinary";

export async function POST(req: Request) {
  try {
    // Xác thực user
    const payload = await verifyToken(req);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { folder = "attachments", tags = "" } = await req.json();

    // Tạo timestamp
    const timestamp = Math.round(new Date().getTime() / 1000);

    // Tạo chữ ký
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder, // Optional: folder lưu trên Cloudinary
        tags, // Optional: thẻ tag cho file
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
    return NextResponse.json(
      { error: "Failed to generate signature" },
      { status: 500 }
    );
  }
}
