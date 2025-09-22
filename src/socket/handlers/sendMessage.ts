import { prisma } from "@/lib/prisma";
import { Server, Socket } from "socket.io";

export const handleSendMessage = async (
  socket: Socket,
  io: Server,
  data: { conversationId: string; content: string },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ack: (response: any) => void
) => {
  const { conversationId, content } = data;
  const userId = socket.data.user.userId;

  try {
    // Lưu message vào DB
    const message = await prisma.messages.create({
      data: {
        conversationId,
        senderUserId: userId,
        senderType: "USER", // Enum từ schema
        content,
        contentType: "TEXT",
      },
    });

    // Update conversations.updatedAt
    await prisma.conversations.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    // Broadcast đến room
    io.to(conversationId).emit("new-message", message);

    // Nếu allowAi=true, trigger AI response (ví dụ: simulate hoặc call AI API)
    const conversation = await prisma.conversations.findUnique({
      where: { id: conversationId },
    });
    if (conversation?.allowAi) {
      // Simulate AI response (thay bằng real AI integration nếu có)
      const aiMessage = await prisma.messages.create({
        data: {
          conversationId,
          senderType: "AI",
          content: `AI response to: ${content}`,
          contentType: "TEXT",
        },
      });
      io.to(conversationId).emit("new-message", aiMessage);
    }

    ack({ success: true, message });
  } catch (error) {
    ack({ error: "Failed to send message" });
  }
};
