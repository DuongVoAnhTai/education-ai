import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const payload = verifyToken(req);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Lấy thông tin chi tiết của conversation
    const conversation = await prisma.conversations.findFirst({
      where: {
        id: id,
        // Điều kiện bảo mật: Đảm bảo người dùng này là một thành viên của cuộc trò chuyện
        participants: {
          some: {
            userId: payload.userId,
          },
        },
      },
      include: {
        // Lấy kèm danh sách người tham gia và thông tin của họ
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                fullName: true,
                role: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    // Nếu không tìm thấy conversation hoặc người dùng không có quyền truy cập
    if (!conversation) {
      return NextResponse.json(
        { success: false, error: "Conversation not found or access denied" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, conversation });
  } catch (error) {
    console.error(`Get conversation error:`, error);
    return NextResponse.json(
      { success: false, error: "Failed to get conversation details" },
      { status: 500 }
    );
  }
}
