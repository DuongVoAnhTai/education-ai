import { Server, Socket } from "socket.io";
import { createClient } from "redis";

// Kết nối đến Redis một lần và tái sử dụng
// Bạn có thể cần cấu trúc lại để truyền redisClient vào
const redisClient = createClient({ url: process.env.REDIS_URL });
redisClient.connect();

const ONLINE_USERS_KEY = "online_users";

export const handleUserConnect = async (socket: Socket, io: Server) => {
  const userId = socket.data.user.userId;
  if (!userId) return;

  // Thêm user vào danh sách online trong Redis
  await redisClient.sAdd(ONLINE_USERS_KEY, userId);

  // Mỗi user sẽ join một room riêng mang tên ID của chính họ
  // Điều này hữu ích để gửi thông báo cá nhân
  socket.join(`user:${userId}`);

  // Thông báo cho TẤT CẢ client khác rằng user này vừa online
  // Dùng `socket.broadcast.emit` để gửi cho mọi người trừ người vừa kết nối
  socket.broadcast.emit("user-online", { userId });

  console.log(
    `✨ User ${userId} is online. Total online: ${await redisClient.sCard(
      ONLINE_USERS_KEY
    )}`
  );
};

export const handleUserDisconnect = async (socket: Socket, io: Server) => {
  const userId = socket.data.user.userId;
  if (!userId) return;

  // Xóa user khỏi danh sách online trong Redis
  await redisClient.sRem(ONLINE_USERS_KEY, userId);

  // Thông báo cho TẤT CẢ client khác rằng user này đã offline
  io.emit("user-offline", { userId });

  console.log(
    `🍂 User ${userId} is offline. Total online: ${await redisClient.sCard(
      ONLINE_USERS_KEY
    )}`
  );
};

// Hàm để client lấy danh sách tất cả user đang online khi vừa kết nối
export const handleGetOnlineUsers = async (socket: Socket) => {
  const onlineUserIds = await redisClient.sMembers(ONLINE_USERS_KEY);
  socket.emit("online-users-list", onlineUserIds);
};
