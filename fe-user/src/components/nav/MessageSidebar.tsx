"use client";

import { useEffect, useMemo, useState } from "react";
import * as conversationService from "@/services/conversationServices";
import { useAuth } from "@/context/AuthContext";

// type ChatFilter = "all" | "ai" | "direct" | "group";
// interface Conversation {
//   id: string;
//   name: string;
//   avatar?: string;
//   lastMessage: string;
//   timestamp: string;
//   isOnline?: boolean;
//   isAI?: boolean;
//   type: "direct" | "group" | "ai";
//   participants?: number;
//   role?: "teacher" | "student";
// }

// interface ChatMessage {
//   id: string;
//   conversationId: string;
//   senderUserId: string | null;
//   senderType: "USER" | "AI" | "SYSTEM";
//   content: string | null;
//   contentType: "TEXT" | "HTML" | "JSON" | "COMMAND";
//   createdAt: string;
//   isDeleted?: boolean;
// }

// interface Message extends ChatMessage {
//   senderName: string;
//   senderAvatar?: string;
//   isAI?: boolean;
//   isMe?: boolean;
//   type: "text" | "image" | "code" | "file";
//   status?: "sending" | "sent" | "delivered" | "read";
//   codeLanguage?: string;
//   fileUrl?: string;
//   fileName?: string;
// }

// const defaultConversations = (): Conversation[] => [
//   {
//     id: "ai-1",
//     name: "AI Tutor - Next.js",
//     lastMessage: "Bạn có câu hỏi gì về Server Components không?",
//     timestamp: new Date().toISOString(),
//     isOnline: true,
//     isAI: true,
//     type: "ai",
//   },
// ];

// const defaultMessages = (): Message[] => [
//   {
//     id: "1",
//     conversationId: "ai-1",
//     senderUserId: "ai",
//     senderType: "AI",
//     content:
//       "Chào bạn! Tôi là AI Tutor chuyên về Next.js. Tôi có thể giúp gì cho bạn hôm nay?",
//     contentType: "TEXT",
//     createdAt: new Date(Date.now() - 3600000).toISOString(),
//     senderName: "AI Tutor",
//     isAI: true,
//     isMe: false,
//     type: "text",
//     status: "read",
//   },
// ];

// const saveData = (key: string, data: any) => {
//   try {
//     if (typeof window === "undefined") return;
//     const fullKey = `${STORAGE_PREFIX}:${key}`;
//     const json = JSON.stringify(data);
//     localStorage.setItem(fullKey, json);
//   } catch (e) {
//     console.error("Save error:", e);
//   }
// };

// const STORAGE_PREFIX = "msg";

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

// const loadData = (key: string, fallback: any = null) => {
//   try {
//     if (typeof window === "undefined") return fallback;
//     const fullKey = `${STORAGE_PREFIX}:${key}`;
//     const stored = localStorage.getItem(fullKey);
//     if (stored) {
//       return JSON.parse(stored);
//     }
//     return fallback;
//   } catch (e) {
//     console.error("Load error:", e);
//     return fallback;
//   }
// };

const MessageSidebar = () => {
  const [apiConversations, setApiConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userDetail: fetchedUser } = useAuth();

  const [chatFilter, setChatFilter] = useState<ChatFilter>("all");
  const [search, setSearch] = useState("");
  const [activeConversation, setActiveConversation] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      setError(null);
      const result = await conversationService.getConversations();

      if (result.error) {
        setError(result.error);
        console.error("Failed to fetch conversations:", result.error);
      } else if (result.conversations) {
        setApiConversations(result.conversations);
        // Set conversation đầu tiên làm active nếu chưa có
        if (!activeConversation && result.conversations.length > 0) {
          setActiveConversation(result.conversations[0].id);
        }
      }
      setLoading(false);
    };

    fetchConversations();
  }, []);

  const sidebarConversations = useMemo((): SidebarConversation[] => {
    return apiConversations.map((conv) => {
      const lastMessage = conv.messages[0];
      let name = conv.title || "Nhóm chat";
      let type: "direct" | "group" | "ai" = "group";

      if (conv.allowAi) {
        type = "ai";
        name = conv.title || "AI Chat";
      } else if (!conv.isGroup) {
        type = "direct";
        // Tìm người tham gia không phải là người dùng hiện tại
        const otherParticipant = conv.participants.find(
          (p) => p.userId !== fetchedUser?.id
        );
        name =
          otherParticipant?.user.fullName ||
          otherParticipant?.user.username ||
          "Người lạ";
      }

      return {
        id: conv.id,
        name: name,
        lastMessage: lastMessage?.content || "Chưa có tin nhắn nào",
        timestamp: lastMessage?.createdAt || conv.updatedAt.toString(),
        type: type,
        participantsCount: conv.participants.length,
        // isOnline, role sẽ cần thêm logic sau
      };
    });
  }, [apiConversations]);

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

  const filteredConversations = useMemo(() => {
    return sidebarConversations
      .filter((c) => (chatFilter === "all" ? true : c.type === chatFilter))
      .filter((c) =>
        search.trim()
          ? c.name.toLowerCase().includes(search.trim().toLowerCase())
          : true
      )
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
  }, [sidebarConversations, chatFilter, search]);

  const getConversationIcon = (conv: SidebarConversation) => {
    if (conv.type === "ai") return Bot;
    if (conv.type === "group") return Users;
    return User;
  };

  const formatTimestamp = (dateStr: string) => {
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

  const getAvatarGradient = (conv: SidebarConversation) => {
    if (conv.type === "ai") return "from-blue-500 to-purple-500";
    if (conv.type === "group") return "from-green-500 to-teal-500";
    if (conv.role === "teacher") return "from-orange-500 to-red-500";
    return "from-gray-500 to-gray-600";
  };

  if (loading) {
    return (
      <div className="w-80 h-screen flex items-center justify-center">
        <p>Loading conversations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-80 h-screen flex items-center justify-center text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-gray-900">Messages</h2>
            <button
              // onClick={() => setShowNewChatModal(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Plus size={20} className="text-gray-600" />
            </button>
          </div>

          <div className="relative mb-3">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Tìm kiếm..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {(["all", "ai", "direct", "group"] as ChatFilter[]).map((t) => (
              <button
                key={t}
                onClick={() => setChatFilter(t)}
                className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  chatFilter === t
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600"
                }`}
              >
                {t === "all"
                  ? "Tất cả"
                  : t === "ai"
                  ? "AI"
                  : t === "direct"
                  ? "1-1"
                  : "Nhóm"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto chat-list-scroll-y-auto scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
          {filteredConversations.map((conv) => {
            const Icon = getConversationIcon(conv);
            return (
              <div
                key={conv.id}
                onClick={() => setActiveConversation(conv.id)}
                className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  activeConversation === conv.id
                    ? "bg-blue-50 border-l-4 border-blue-500"
                    : ""
                }`}
              >
                <div className="relative">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-r ${getAvatarGradient(
                      conv
                    )}`}
                  >
                    <Icon size={20} className="text-white" />
                  </div>
                  {conv.isOnline && conv.type !== "group" && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>

                <div className="flex-1 ml-3 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {conv.name}
                      </h3>
                      {conv.role === "teacher" && (
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                          Teacher
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate flex-1">
                      {conv.lastMessage}
                    </p>
                    <span className="text-xs text-gray-500">
                      {formatTimestamp(conv.timestamp)}
                    </span>
                  </div>

                  {conv.type === "group" && (
                    <p className="text-xs text-gray-500 mt-1">
                      {conv.participantsCount} thành viên
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MessageSidebar;
