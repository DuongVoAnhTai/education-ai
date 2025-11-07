import * as Icon from "@/assets/Image";

export const getConversationType = (conv: Conversation): ChatFilter => {
  if (conv.allowAi) return "ai";
  if (conv.isGroup) return "group";
  return "direct";
};

export const getConversationName = (
  conv: Conversation,
  currentUserId?: string
): string => {
  const type = getConversationType(conv);
  if (type === "ai") {
    return conv.title || "AI Tutor";
  }
  if (type === "group") {
    return conv.title || "Cuộc trò chuyện nhóm";
  }
  // Nếu là chat 1-1, tìm tên của người còn lại
  const otherParticipant = conv.participants.find(
    (p) => p.user.id !== currentUserId
  );
  return otherParticipant?.user.fullName || "Người dùng không xác định";
};

export const getConversationIcon = (type: ChatFilter) => {
  if (type === "ai") return Icon.Bot;
  if (type === "group") return Icon.Users;
  return Icon.User;
};

export const formatTimestamp = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return "Vừa xong";
  if (minutes < 60) return `${minutes} phút`;
  if (hours < 24) return `${hours} giờ`;
  if (days < 7) return `${days} ngày`;
  return date.toLocaleDateString("vi-VN");
};

export const getAvatarGradient = (type: ChatFilter, role?: string) => {
  if (type === "ai") return "from-blue-500 to-purple-500";
  if (type === "group") return "from-green-500 to-teal-500";
  if (role === "teacher") return "from-orange-500 to-red-500";
  return "from-gray-500 to-gray-600";
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
