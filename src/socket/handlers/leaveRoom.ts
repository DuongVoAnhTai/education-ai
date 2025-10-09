import { Socket } from "socket.io";
import { prisma } from "@/lib/prisma";

export const handleLeaveRoom = async (
  socket: Socket,
  data: { conversationId: string }
) => {
  const { conversationId } = data;
  const userId = socket.data.user.userId;

  try {
    const participant = await prisma.conversationParticipants.findFirst({
      where: { conversationId, userId, isAi: false },
    });
    if (!participant) return;

    socket.leave(conversationId);
    console.log(`User ${userId} left room ${conversationId}`);
  } catch (error: any) {
    console.error(`Leave room error for user ${userId}:`, error.message);
  }
};
