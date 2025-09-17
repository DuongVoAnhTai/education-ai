import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  try {
    // Verify token and check role
    const payload = verifyToken(req);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Chỉ cho phép ADMIN truy cập
    if (!["ADMIN"].includes(payload.role)) {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }

    const userId = id;

    const user = await prisma.users.findUnique({
      where: {
        id: userId,
        isDeleted: false, // Không lấy user đã bị xóa
        role: "STUDENT", // Chỉ lấy thông tin học sinh
      },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
        // Có thể thêm các relations khác như:
        // quizAttempts: true,
        // chatMessages: true
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching student:", error);
    return NextResponse.json(
      { error: "Failed to fetch student information" },
      { status: 500 }
    );
  }
}
