import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const payload = verifyToken(req);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
    const offset = (page - 1) * limit;

    const { id: conversationId } = params;

    // Check if user is participant
    const participant = await prisma.conversationParticipants.findFirst({
      where: {
        conversationId,
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

    const [messages, total] = await Promise.all([
      prisma.messages.findMany({
        where: {
          conversationId,
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
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
      }),
      prisma.messages.count({
        where: { conversationId },
      }),
    ]);

    return NextResponse.json({
      success: true,
      messages: messages.reverse(), // Reverse để có thứ tự từ cũ đến mới
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
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

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const payload = verifyToken(req);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: conversationId } = params;

    // Check if user is participant
    const participant = await prisma.conversationParticipants.findFirst({
      where: {
        conversationId,
        userId: payload.userId,
        isAi: false,
      },
    });

    if (!participant) {
      return NextResponse.json(
        {
          success: false,
          error: "Not authorized to send message in this conversation",
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { content, contentType = "TEXT", senderType = "USER" } = body;

    // Basic validation
    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Message content is required",
        },
        { status: 400 }
      );
    }

    if (content.length > 5000) {
      return NextResponse.json(
        {
          success: false,
          error: "Message too long (max 5000 characters)",
        },
        { status: 400 }
      );
    }

    // Validate senderType
    const validSenderTypes = ["USER", "AI", "SYSTEM"];
    if (!validSenderTypes.includes(senderType)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid sender type",
        },
        { status: 400 }
      );
    }

    // Validate contentType
    const validContentTypes = ["TEXT", "HTML", "JSON", "COMMAND"];
    if (!validContentTypes.includes(contentType)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid content type",
        },
        { status: 400 }
      );
    }

    // Create message
    const message = await prisma.messages.create({
      data: {
        conversationId,
        senderUserId: senderType === "USER" ? payload.userId : null,
        senderType,
        content: content.trim(),
        contentType,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Update conversation updatedAt
    await prisma.conversations.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json(
      {
        success: true,
        message,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create message error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create message",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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
  { params }: { params: { id: string } }
) {
  try {
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
