import { Socket } from "socket.io";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

dotenv.config({ path: ".env" });

export const authenticateSocket = async (
  socket: Socket,
  next: (err?: Error) => void
) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Unauthorized: No token provided"));
  }

  try {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is not defined");
    }

    const decoded = jwt.verify(token, secret) as {
      userId: string;
      role: string;
    };

    // Kiểm tra user tồn tại
    const user = await prisma.users.findFirst({
      where: { id: decoded.userId, isDeleted: false },
      select: { id: true, username: true, role: true },
    });

    if (!user) {
      return next(new Error("Unauthorized: User not found or deleted"));
    }

    socket.data.user = {
      userId: user.id,
      role: user.role,
      username: user.username,
    };
    next();
  } catch (err: any) {
    console.error("Socket auth error:", err.message);
    next(new Error(`Unauthorized: ${err.message}`));
  }
};
