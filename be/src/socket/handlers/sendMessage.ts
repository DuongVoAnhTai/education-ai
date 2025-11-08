import { prisma } from "@/lib/prisma";
import { Server, Socket } from "socket.io";

type ContentType = "TEXT" | "IMAGE" | "IMAGE" | "FILE";

export const handleSendMessage = async (
  socket: Socket,
  io: Server,
  data: {
    conversationId: string;
    content: string;
    contentType?: ContentType;
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
    fileFormat?: string;
  },
  ack: (response: any) => void
) => {
  const {
    conversationId,
    content,
    contentType,
    fileUrl,
    fileName,
    fileSize,
    fileFormat,
  } = data;
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
        contentType: data.contentType || "TEXT",
        fileUrl: data.fileUrl,
        fileName: data.fileName,
        fileSize: data.fileSize,
        fileFormat: data.fileFormat,
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

    // Gửi ack cho người dùng ngay, không cần chờ AI
    ack({ success: true, message });

    // Xử lý AI response
    if (conversation.allowAi) {
      processAiResponse(
        conversationId,
        content,
        io,
        contentType,
        fileUrl,
        fileName,
        fileSize,
        fileFormat
      );
    }

    ack({ success: true, message });
  } catch (error: any) {
    console.error(`Send message error for user ${userId}:`, error.message);
    ack({ error: `Failed to send message: ${error.message}` });
  }
};

async function processAiResponse(
  conversationId: string,
  userContent: string,
  io: Server,
  contentType?: ContentType,
  fileUrl?: string,
  fileName?: string,
  fileSize?: number,
  fileFormat?: string
) {
  try {
    // 1. Gọi đến dịch vụ AI của bạn (ví dụ: OpenAI, Gemini)
    const aiContent = await getAiReply(userContent); // Đây là hàm giả định

    // 2. Tạo tin nhắn AI trong CSDL
    const aiMessage = await prisma.messages.create({
      data: {
        conversationId,
        senderType: "AI",
        content: `AI response to: ${userContent}`,
        contentType: contentType || "TEXT",
        fileUrl: fileUrl,
        fileName: fileName,
        fileSize: fileSize,
        fileFormat: fileFormat,
      },
      include: {
        sender: {
          select: { id: true, username: true, avatarUrl: true },
        },
      },
    });

    // 3. Gửi tin nhắn AI đến client
    io.to(conversationId).emit("new-message", aiMessage);
  } catch (error) {
    console.error("AI processing error:", error);
    // Có thể gửi một tin nhắn lỗi về cho client
    io.to(conversationId).emit("ai-error", {
      message: "AI is currently unavailable",
    });
  }
}

function getAiReply(userContent: string) {
  console.log(userContent);
}
