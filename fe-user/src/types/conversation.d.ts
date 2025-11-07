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
  sender: { id: string; username: string; fullName: string; avatarUrl: string };
  createdAt: string;
  fileUrl?: string;
  fileName?: string;
  fileSize: number;
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

type ChatFilter = "all" | "ai" | "direct" | "group";
