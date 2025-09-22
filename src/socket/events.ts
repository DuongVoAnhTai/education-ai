import { Server, Socket } from "socket.io";
import { handleJoinRoom } from "./handlers/joinRoom";
import { handleSendMessage } from "./handlers/sendMessage";

export const setupEventHandlers = (socket: Socket, io: Server) => {
  socket.on('join-room', (data, ack) => handleJoinRoom(socket, data, ack));
  socket.on('send-message', (data, ack) => handleSendMessage(socket, io, data, ack));
  // Thêm event khác nếu cần, ví dụ: 'leave-room', 'typing'
};