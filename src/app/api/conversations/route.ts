import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const payload = verifyToken(req);
    if (!payload)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const conversations = await prisma.conversations.findMany({
      where: {
        participants: { some: { userId: payload.userId } },
      },
      orderBy: { updatedAt: "desc" },
      include: {
        participants: {
          include: {
            user: {
              select: { id: true, username: true, role: true, avatarUrl: true },
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

    return NextResponse.json({ conversations });
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
    const payload = verifyToken(req);
    if (!payload)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { title, participantIds = [], isGroup, allowAi } = await req.json();

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

    // Check if 1-1 conversation already exists
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
          messages: { some: {} }, // Đã có message
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

    const conversation = await prisma.conversations.create({
      data: {
        createdBy: payload.userId,
        title,
        isGroup: isGroup ?? false,
        allowAi: allowAi ?? false,
        participants: {
          create: [
            { userId: payload.userId, isAi: false },
            // Other participants
            ...(participantIds || []).map((id: string) => ({
              userId: id,
              isAi: false,
            })),
            // ...(allowAi ? [{ userId: payload.userId, isAi: true }] : []), // thêm AI bot nếu bật
          ],
        },
      },
      include: {
        participants: {
          include: {
            user: { select: { id: true, username: true, avatarUrl: true } },
          },
          select: { isAi: true },
        },
        messages: true,
      },
    });

    // Thêm AI participant nếu allowAi=true (sau khi tạo conversation)
    if (allowAi) {
      await prisma.conversationParticipants.create({
        data: {
          conversationId: conversation.id,
          userId: payload.userId, // Use creator's userId for AI
          isAi: true,
        },
      });
    }

    return NextResponse.json({ conversation }, { status: 201 });
  } catch (error) {
    console.error("Create conversation error:", error);
    return NextResponse.json(
      { error: "Failed to create conversation" },
      { status: 500 }
    );
  }
}
