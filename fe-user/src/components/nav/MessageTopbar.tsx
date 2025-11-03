"use client";

import { Info, MoreVertical, Phone, UserPlus, Video } from "lucide-react";
import { useState } from "react";

const STORAGE_PREFIX = "msg";

interface Conversation {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  isOnline?: boolean;
  isAI?: boolean;
  type: "direct" | "group" | "ai";
  participants?: number;
  role?: "teacher" | "student";
}

interface Message extends ChatMessage {
  senderName: string;
  senderAvatar?: string;
  isAI?: boolean;
  isMe?: boolean;
  type: "text" | "image" | "code" | "file";
  status?: "sending" | "sent" | "delivered" | "read";
  codeLanguage?: string;
  fileUrl?: string;
  fileName?: string;
}

interface ChatMessage {
  id: string;
  conversationId: string;
  senderUserId: string | null;
  senderType: "USER" | "AI" | "SYSTEM";
  content: string | null;
  contentType: "TEXT" | "HTML" | "JSON" | "COMMAND";
  createdAt: string;
  isDeleted?: boolean;
}

const loadData = (key: string, fallback: any = null) => {
  try {
    if (typeof window === "undefined") return fallback;
    const fullKey = `${STORAGE_PREFIX}:${key}`;
    const stored = localStorage.getItem(fullKey);
    if (stored) {
      return JSON.parse(stored);
    }
    return fallback;
  } catch (e) {
    console.error("Load error:", e);
    return fallback;
  }
};

const defaultConversations = (): Conversation[] => [
  {
    id: "ai-1",
    name: "AI Tutor - Next.js",
    lastMessage: "Bạn có câu hỏi gì về Server Components không?",
    timestamp: new Date().toISOString(),
    isOnline: true,
    isAI: true,
    type: "ai",
  },
];

const defaultMessages = (): Message[] => [
  {
    id: "1",
    conversationId: "ai-1",
    senderUserId: "ai",
    senderType: "AI",
    content:
      "Chào bạn! Tôi là AI Tutor chuyên về Next.js. Tôi có thể giúp gì cho bạn hôm nay?",
    contentType: "TEXT",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    senderName: "AI Tutor",
    isAI: true,
    isMe: false,
    type: "text",
    status: "read",
  },
];

const Search = (p: any) => (
  <IconBase {...p}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </IconBase>
);
const Plus = (p: any) => (
  <IconBase {...p}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </IconBase>
);
const X = (p: any) => (
  <IconBase {...p}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </IconBase>
);
const Bot = (p: any) => (
  <IconBase {...p}>
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <circle cx="12" cy="5" r="2" />
    <path d="M12 7v4" />
  </IconBase>
);
const Users = (p: any) => (
  <IconBase {...p}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </IconBase>
);
const User = (p: any) => (
  <IconBase {...p}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </IconBase>
);

const IconBase = ({ size = 20, className = "", children }: any) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {children}
  </svg>
);

const saveData = (key: string, data: any) => {
  try {
    if (typeof window === "undefined") return;
    const fullKey = `${STORAGE_PREFIX}:${key}`;
    const json = JSON.stringify(data);
    localStorage.setItem(fullKey, json);
  } catch (e) {
    console.error("Save error:", e);
  }
};

const MessageTopbar = () => {
  const [activeConversation, setActiveConversation] = useState<string>(() => {
    return loadData("activeConversation", "ai-1");
  });

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = loadData("conversations", null);
    if (saved && saved.length > 0) return saved;
    const defaults = defaultConversations();
    saveData("conversations", defaults);
    saveData("messages:ai-1", defaultMessages());
    return defaults;
  });

  const getConversationIcon = (conv: Conversation) => {
    if (conv.type === "ai") return Bot;
    if (conv.type === "group") return Users;
    return User;
  };
  const getActiveConversation = () =>
    conversations.find((c) => c.id === activeConversation);

  const activeConv = getActiveConversation();
  if (!activeConv) return null;

  const getAvatarGradient = (conv: Conversation) => {
    if (conv.type === "ai") return "from-blue-500 to-purple-500";
    if (conv.type === "group") return "from-green-500 to-teal-500";
    if (conv.role === "teacher") return "from-orange-500 to-red-500";
    return "from-gray-500 to-gray-600";
  };

  return (
    <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
      <div className="flex items-center">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-r ${getAvatarGradient(
            activeConv
          )}`}
        >
          {(() => {
            const Icon = getConversationIcon(activeConv);
            return <Icon size={20} className="text-white" />;
          })()}
        </div>
        <div className="ml-3">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-gray-900">{activeConv.name}</h3>
            {activeConv.type === "ai" && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                AI Assistant
              </span>
            )}
            {activeConv.role === "teacher" && (
              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                Teacher
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">
            {activeConv.type === "group"
              ? `${activeConv.participants} thành viên`
              : activeConv.isOnline
              ? "Đang hoạt động"
              : "Offline"}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {activeConv.type !== "ai" && (
          <>
            <button
              onClick={() => alert("📞 Demo gọi thoại")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Phone size={20} className="text-gray-600" />
            </button>
            <button
              onClick={() => alert("🎥 Demo video call")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Video size={20} className="text-gray-600" />
            </button>
          </>
        )}
        {activeConv.type === "group" && (
          <button
            onClick={() => alert("➕ Thêm thành viên")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <UserPlus size={20} className="text-gray-600" />
          </button>
        )}
        <button
          onClick={() => alert("ℹ️ Thông tin hội thoại")}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Info size={20} className="text-gray-600" />
        </button>
        <button
          onClick={() => alert("⋮ Menu thêm")}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <MoreVertical size={20} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default MessageTopbar;
