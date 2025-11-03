interface ConversationParticipant {
  userId: string;
  isAi: boolean;
  user: User;
}

interface Message {
  id: string;
  conversationId: string;
  content: string;
  contentType: string;
  senderType: string;
  sender: { id: string; username: string; avatarUrl: string };
  createdAt: string;
}

interface Conversation {
  id: string;
  title?: string;
  isGroup: boolean;
  allowAi: boolean;
  participants: ConversationParticipant[];
  messages: Message[]; // Thường chỉ có last message từ API
  updatedAt: Date;
}

interface SidebarConversation {
  id: string;
  name: string;
  avatar?: string; // Sẽ không dùng trực tiếp, nhưng giữ lại cho tương lai
  lastMessage: string;
  timestamp: string;
  isOnline?: boolean;
  type: "direct" | "group" | "ai";
  participantsCount?: number;
  role?: "teacher" | "student"; // Lấy từ user role
};

type ChatFilter = "all" | "ai" | "direct" | "group";
