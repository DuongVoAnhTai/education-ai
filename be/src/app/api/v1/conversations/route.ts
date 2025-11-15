import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const payload = await verifyToken(req);
    if (!payload)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const take = parseInt(searchParams.get("take") || "20");
    const cursor = searchParams.get("cursor"); // Đây là giá trị ID của cuộc trò chuyện cuối cùng

    const conversations = await prisma.conversations.findMany({
      take: take,
      // Bỏ qua bản ghi đầu tiên nếu có cursor
      skip: cursor ? 1 : 0,
      // Bắt đầu tìm từ cursor
      cursor: cursor
        ? {
            id: cursor,
          }
        : undefined,

      where: {
        participants: { some: { userId: payload.userId } },
      },
      orderBy: { updatedAt: "desc" },
      include: {
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
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1, // lấy tin nhắn cuối cùng
          select: {
            id: true,
            content: true,
            createdAt: true,
            senderType: true,
            sender: {
              select: { id: true, username: true, avatarUrl: true },
            },
          },
        },
      },
    });

    // Trả về một cursor mới cho client để dùng cho lần fetch tiếp theo
    const lastConversation = conversations[conversations.length - 1];
    const nextCursor = lastConversation ? lastConversation.id : null;

    return NextResponse.json({ conversations, nextCursor });
  } catch (error) {
    console.error("Get conversations error:", error);
    return NextResponse.json(
      { error: "Failed to get conversations" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    // Xác thực token
    const payload = await verifyToken(req);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse body
    const {
      title,
      participantIds = [],
      isGroup = false,
      allowAi = false,
    } = await req.json();

    // Kiểm tra participantIds có hợp lệ không
    if (!Array.isArray(participantIds)) {
      return NextResponse.json(
        { error: "participantIds must be an array" },
        { status: 400 }
      );
    }

    // Validate participants exist (nếu không phải group chat với AI only)
    if (participantIds.length > 0) {
      const existingUsers = await prisma.users.findMany({
        where: {
          id: { in: participantIds },
          isDeleted: false,
        },
        select: { id: true },
      });

      const existingUserIds = existingUsers.map((u) => u.id);
      const invalidIds = participantIds.filter(
        (id: string) => !existingUserIds.includes(id)
      );

      if (invalidIds.length > 0) {
        return NextResponse.json(
          {
            success: false,
            error: "Some participants not found",
            invalidIds,
          },
          { status: 400 }
        );
      }
    }

    // Check if 1-1 conversation already exists (chỉ áp dụng cho chat 1-1)
    if (!isGroup && participantIds.length === 1) {
      const existingConversation = await prisma.conversations.findFirst({
        where: {
          isGroup: false,
          participants: {
            every: {
              userId: {
                in: [payload.userId, participantIds[0]],
              },
              isAi: false,
            },
          },
        },
        select: { id: true },
      });

      if (existingConversation) {
        return NextResponse.json(
          {
            success: false,
            error: "1-1 conversation already exists",
            existingConversationId: existingConversation.id,
          },
          { status: 409 }
        );
      }
    }

    if (isGroup && participantIds.length < 2) {
      return NextResponse.json(
        { error: "Group chat requires at least 2 participants" },
        { status: 400 }
      );
    }
    if (participantIds.length > 100) {
      // Giới hạn
      return NextResponse.json(
        { error: "Too many participants (max 100)" },
        { status: 400 }
      );
    }

    // Tạo conversation
    const conversation = await prisma.conversations.create({
      data: {
        createdBy: payload.userId,
        title: title || null, // Đảm bảo title là null nếu không có
        isGroup,
        allowAi,
        participants: {
          create: [
            { userId: payload.userId, isAi: false }, // Thêm người tạo
            // Thêm các participants khác
            ...participantIds.map((id: string) => ({
              userId: id,
              isAi: false,
            })),
          ],
        },
      },
      include: {
        participants: {
          include: {
            user: { select: { id: true, username: true, avatarUrl: true } },
          },
        },
        messages: true,
      },
    });

    // Thêm AI participant nếu allowAi=true
    if (allowAi) {
      await prisma.conversationParticipants.create({
        data: {
          conversationId: conversation.id,
          userId: payload.userId, // Dùng userId của creator cho AI
          isAi: true,
        },
      });
    }

    return NextResponse.json({ conversation }, { status: 201 });
  } catch (error: any) {
    console.error("Create conversation error:", {
      message: error.message,
      stack: error.stack,
      participantIds: (error as any).participantIds,
    });
    return NextResponse.json(
      { error: `Failed to create conversation: ${error.message}` },
      { status: 500 }
    );
  }
}
