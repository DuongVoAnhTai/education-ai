import { Server, Socket } from "socket.io";
import { handleJoinRoom } from "./handlers/joinRoom";
import { handleSendMessage } from "./handlers/sendMessage";
import { handleLeaveRoom } from "./handlers/leaveRoom";
import { handleTyping } from "./handlers/typing";

export const setupEventHandlers = (socket: Socket, io: Server) => {
  socket.on("join-room", (data, ack) => handleJoinRoom(socket, data, ack));
  socket.on("send-message", (data, ack) =>
    handleSendMessage(socket, io, data, ack)
  );
  socket.on("leave-room", (data, ack) =>
    handleLeaveRoom(socket, io, data, ack)
  );
  socket.on("typing", (data) => handleTyping(socket, io, data));
};
