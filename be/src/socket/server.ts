import { createServer } from "http";
import { Server } from "socket.io";
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";
import { authenticateSocket } from "./auth";
import { setupEventHandlers } from "./events";

let pubClient: ReturnType<typeof createClient>;
let subClient: ReturnType<typeof createClient>;

const PORT = process.env.NEXT_PUBLIC_SOCKET_PORT || 4000;

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin:
      process.env.NODE_ENV === "production" ? ["https://yourdomain.com"] : "*",
    methods: ["GET", "POST"],
  },
});

async function connectRedis() {
  try {
    pubClient = createClient({ url: process.env.REDIS_URL });
    subClient = pubClient.duplicate();

    console.log("pubClient", pubClient);
    console.log("subClient", subClient);

    await Promise.all([pubClient.connect(), subClient.connect()]);
    io.adapter(createAdapter(pubClient, subClient));

    console.log("✅ Connected to Redis Cloud");
  } catch (err) {
    console.error("❌ Redis connection failed:", err);
  }
}

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

connectRedis().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`🚀 Socket.IO server running on port ${PORT}`);
  });
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
process.on("SIGTERM", async () => {
  console.log("SIGTERM received. Closing server...");
  await Promise.allSettled([pubClient.disconnect(), subClient.disconnect()]);
  io.close(() => {
    console.log("Socket.IO server closed");
    httpServer.close(() => {
      console.log("HTTP server closed");
      process.exit(0);
    });
  });
});

export {};
