import { prisma } from "@/lib/prisma";
import { Socket } from "socket.io";

export const handleJoinRoom = async (
  socket: Socket,
  data: { conversationId: string },
  ack: (response: any) => void
) => {
  const { conversationId } = data;
  const userId = socket.data.user.userId;

  try {
    // Kiểm tra conversation tồn tại
    const conversation = await prisma.conversations.findUnique({
      where: { id: conversationId },
    });
    if (!conversation) {
      return ack({ error: "Conversation not found" });
    }

    // Kiểm tra user là participant
    const participant = await prisma.conversationParticipants.findFirst({
      where: { conversationId, userId, isAi: false }, // Chỉ cho phép non-AI participant
    });
    if (!participant) {
      return ack({ error: "Not authorized to join this conversation" });
    }

    // Kiểm tra isMuted
    if (participant.isMuted) {
      return ack({ error: "You are muted in this conversation" });
    }

    socket.join(conversationId);
    console.log(`User ${userId} joined room ${conversationId}`);
    ack({ success: true, message: `Joined room ${conversationId}` });
  } catch (error: any) {
    console.error(`Join room error for user ${userId}:`, error.message);
    ack({ error: `Failed to join room: ${error.message}` });
  }
};
