import { createServer } from "http";
import { Server } from "socket.io";
import { authenticateSocket } from "./auth";
import { setupEventHandlers } from "./events";

const PORT = process.env.NEXT_PUBLIC_SOCKET_PORT || 4000;

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin:
      process.env.NODE_ENV === "production" ? ["https://yourdomain.com"] : "*",
    methods: ["GET", "POST"],
  },
});

// Middleware để auth tất cả kết nối
io.use(authenticateSocket);

// Setup event handlers khi kết nối thành công
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  setupEventHandlers(socket, io); // Truyền socket và io để handle events

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});

// Xử lý lỗi server
httpServer.on("error", (error: NodeJS.ErrnoException) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use`);
  } else {
    console.error("Server error:", error);
  }
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Closing server...");
  io.close(() => {
    console.log("Socket.IO server closed");
    httpServer.close(() => {
      console.log("HTTP server closed");
      process.exit(0);
    });
  });
});

export {};
