import { Server, Socket } from "socket.io";
import { prisma } from "@/lib/prisma";

export const handleTyping = async (
  socket: Socket,
  io: Server,
  data: { conversationId: string }
) => {
  const { conversationId } = data;
  const userId = socket.data.user.userId;

  try {
    const participant = await prisma.conversationParticipants.findFirst({
      where: { conversationId, userId, isAi: false },
    });
    if (!participant) return;

    socket.to(conversationId).emit("user-typing", {
      userId,
      username: socket.data.user.username,
    });
  } catch (error: any) {
    console.error(`Typing error for user ${userId}:`, error.message);
  }
};
