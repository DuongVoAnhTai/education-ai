import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const payload = verifyToken(req);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    if (!query) {
      return NextResponse.json(
        { success: false, error: "Query parameter is required" },
        { status: 400 }
      );
    }

    const users = await prisma.users.findMany({
      where: {
        OR: [
          { email: { contains: query, mode: "insensitive" } },
          { username: { contains: query, mode: "insensitive" } },
        ],
        isDeleted: false,
        id: { not: payload.userId }, // Loại trừ chính user hiện tại
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        avatarUrl: true,
        role: true,
      },
      take: 10, // Giới hạn 10 kết quả để tối ưu
    });

    return NextResponse.json({
      success: true,
      users,
      count: users.length,
    });
  } catch (error) {
    console.error("Search users error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to search users" },
      { status: 500 }
    );
  }
}
