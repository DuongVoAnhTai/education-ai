import { Socket } from "socket.io";
import jwt from 'jsonwebtoken';

export const authenticateSocket = (socket: Socket, next: (err?: Error) => void) => {
  const token = socket.handshake.auth.token; // Client gửi token qua auth
  if (!token) {
    return next(new Error('Unauthorized: No token provided'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret') as { userId: string; role: string };
    socket.data.user = decoded; // Lưu user data vào socket để dùng sau
    next();
  } catch (err) {
    next(new Error('Unauthorized: Invalid token'));
  }
};