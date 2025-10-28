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

    // Check if user is participant
    const participant = await prisma.conversationParticipants.findFirst({
      where: {
        conversationId: id,
        userId: payload.userId,
        isAi: false,
      },
    });

    if (!participant) {
      return NextResponse.json(
        {
          success: false,
          error: "Not authorized to access this conversation",
        },
        { status: 403 }
      );
    }

    const messages = await prisma.messages.findMany({
      where: {
        conversationId: id,
      },
      orderBy: { createdAt: "asc" }, // Sắp xếp từ cũ đến mới
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      messages,
      count: messages.length,
    });
  } catch (error) {
    console.error("Get messages error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to get messages",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const payload = verifyToken(req);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Note: Message editing logic would go here
    // For now, return not implemented
    return NextResponse.json(
      {
        success: false,
        error: "Message editing not implemented",
      },
      { status: 501 }
    );
  } catch (error) {
    console.error("Update message error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update message",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const payload = verifyToken(req);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Note: Message deletion logic would go here
    // For now, return not implemented
    return NextResponse.json(
      {
        success: false,
        error: "Message deletion not implemented",
      },
      { status: 501 }
    );
  } catch (error) {
    console.error("Delete message error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete message",
      },
      { status: 500 }
    );
  }
}
