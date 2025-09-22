import { prisma } from "@/lib/prisma";
import { Socket } from "socket.io";

export const handleJoinRoom = async (
  socket: Socket,
  data: { conversationId: string },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ack: (response: any) => void
) => {
  const { conversationId } = data;
  const userId = socket.data.user.userId;

  try {
    // Check nếu user là participant
    const participant = await prisma.conversationParticipants.findFirst({
      where: { conversationId, userId },
    });
    if (!participant) {
      return ack({ error: "Not authorized to join this conversation" });
    }

    socket.join(conversationId); // Join room
    ack({ success: true, message: `Joined room ${conversationId}` });
  } catch (error) {
    ack({ error: "Failed to join room" });
  }
};
