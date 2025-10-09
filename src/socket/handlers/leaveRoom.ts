import { prisma } from "@/lib/prisma";
import { Server, Socket } from "socket.io";

export const handleLeaveRoom = async (
  socket: Socket,
  io: Server,
  data: { conversationId: string },
  ack: (response: any) => void
) => {
  const { conversationId } = data;
  const userId = socket.data.user.userId;

  try {
    // Xóa hoặc soft-delete participant
    await prisma.conversationParticipants.delete({
      where: {
        conversationId_userId_isAi: { conversationId, userId, isAi: false },
      },
    });

    socket.leave(conversationId);
    io.to(conversationId).emit("user-left", {
      userId,
      message: "User left the group",
    });

    ack({ success: true });
  } catch (error: any) {
    ack({ error: "Failed to leave room" });
  }
};
