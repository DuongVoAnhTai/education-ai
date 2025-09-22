import { createServer } from "http";
import { Server } from "socket.io";
import { authenticateSocket } from "./auth";
import { setupEventHandlers } from "./events";

//Khởi tạo HTTP server và attach Socket.IO
const PORT = process.env.SOCKET_PORT || 3001;

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: '*', // Thay bằng domain thực tế ở production
    methods: ['GET', 'POST'],
  },
});

// Middleware để auth tất cả kết nối
io.use(authenticateSocket);

// Setup event handlers khi kết nối thành công
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  setupEventHandlers(socket, io); // Truyền socket và io để handle events

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});