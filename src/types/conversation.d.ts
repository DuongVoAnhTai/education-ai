interface ConversationParticipant {
  userId: string;
  isAi: boolean;
  user: User;
}

interface Message {
  id: string;
  content: string;
  createdAt: Date;
  senderType: 'USER' | 'AI' | 'SYSTEM';
  sender: User;
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