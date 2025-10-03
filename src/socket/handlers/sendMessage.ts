import { prisma } from "@/lib/prisma";
import { Server, Socket } from "socket.io";

export const handleSendMessage = async (
  socket: Socket,
  io: Server,
  data: { conversationId: string; content: string },
  ack: (response: any) => void
) => {
  const { conversationId, content } = data;
  const userId = socket.data.user.userId;

  try {
    // Validate content
    if (!content || content.trim().length === 0) {
      return ack({ error: "Message content is required" });
    }
    if (content.length > 5000) {
      return ack({ error: "Message too long (max 5000 characters)" });
    }

    // Kiểm tra conversation tồn tại
    const conversation = await prisma.conversations.findUnique({
      where: { id: conversationId },
    });
    if (!conversation) {
      return ack({ error: "Conversation not found" });
    }

    // Kiểm tra user là participant
    const participant = await prisma.conversationParticipants.findFirst({
      where: { conversationId, userId, isAi: false },
    });
    if (!participant) {
      return ack({
        error: "Not authorized to send message in this conversation",
      });
    }
    if (participant.isMuted) {
      return ack({ error: "You are muted in this conversation" });
    }

    // Kiểm tra tin nhắn trùng lặp (dựa trên content và thời gian gần đây)
    const recentMessage = await prisma.messages.findFirst({
      where: {
        conversationId,
        senderUserId: userId,
        content: content.trim(),
        createdAt: { gte: new Date(Date.now() - 1000) }, // Trong 1 giây
      },
    });
    if (recentMessage) {
      return ack({ success: true, message: recentMessage }); // Trả về tin nhắn đã có
    }

    // Tạo message
    const message = await prisma.messages.create({
      data: {
        conversationId,
        senderUserId: userId,
        senderType: "USER",
        content: content.trim(),
        contentType: "TEXT",
      },
      include: {
        sender: {
          select: { id: true, username: true, avatarUrl: true },
        },
      },
    });

    // Cập nhật conversations.updatedAt
    await prisma.conversations.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    // Broadcast đến room
    io.to(conversationId).emit("new-message", message);

    // Xử lý AI response
    if (conversation.allowAi) {
      const aiMessage = await prisma.messages.create({
        data: {
          conversationId,
          senderType: "AI",
          content: `AI response to: ${content}`,
          contentType: "TEXT",
        },
        include: {
          sender: {
            select: { id: true, username: true, avatarUrl: true },
          },
        },
      });
      io.to(conversationId).emit("new-message", aiMessage);
    }

    ack({ success: true, message });
  } catch (error: any) {
    console.error(`Send message error for user ${userId}:`, error.message);
    ack({ error: `Failed to send message: ${error.message}` });
  }
};
