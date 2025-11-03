"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/** =========================
 * Types (chuẩn theo Prisma)
 * =======================**/
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

interface Conversation {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline?: boolean;
  isAI?: boolean;
  type: "direct" | "group" | "ai";
  participants?: number;
  role?: "teacher" | "student";
}

type ChatFilter = "all" | "ai" | "direct" | "group";
type NewChatType = "ai" | "direct" | "group";

/** =========================
 * Storage Helper (localStorage)
 * =======================**/
const STORAGE_PREFIX = "msg";

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

/** =========================
 * Default Data
 * =======================**/
const defaultConversations = (): Conversation[] => [
  {
    id: "ai-1",
    name: "AI Tutor - Next.js",
    lastMessage: "Bạn có câu hỏi gì về Server Components không?",
    timestamp: new Date().toISOString(),
    unreadCount: 2,
    isOnline: true,
    isAI: true,
    type: "ai",
  },
  {
    id: "teacher-1",
    name: "Thầy Nguyễn Văn A",
    lastMessage: "Em đã hoàn thành bài tập chưa?",
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    unreadCount: 1,
    isOnline: true,
    type: "direct",
    role: "teacher",
  },
  {
    id: "student-1",
    name: "Trần Thị B",
    lastMessage: "Cảm ơn bạn đã giúp mình!",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    unreadCount: 0,
    isOnline: false,
    type: "direct",
    role: "student",
  },
  {
    id: "group-1",
    name: "Nhóm học Web Development",
    lastMessage: "Ai đã làm bài tập về React hooks chưa?",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    unreadCount: 5,
    type: "group",
    participants: 12,
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
  {
    id: "2",
    conversationId: "ai-1",
    senderUserId: "me",
    senderType: "USER",
    content: "Bạn có thể giải thích về Server Components trong Next.js không?",
    contentType: "TEXT",
    createdAt: new Date(Date.now() - 3500000).toISOString(),
    senderName: "Bạn",
    isMe: true,
    type: "text",
    status: "read",
  },
  {
    id: "3",
    conversationId: "ai-1",
    senderUserId: "ai",
    senderType: "AI",
    content:
      "Server Components là components render trên server, không gửi JavaScript xuống client. Điều này giúp giảm bundle size và cải thiện performance.",
    contentType: "TEXT",
    createdAt: new Date(Date.now() - 3400000).toISOString(),
    senderName: "AI Tutor",
    isAI: true,
    isMe: false,
    type: "text",
    status: "read",
  },
  {
    id: "4",
    conversationId: "ai-1",
    senderUserId: "ai",
    senderType: "AI",
    content: `// app/products/page.tsx - Server Component (default)
async function ProductsPage() {
  // Fetch trực tiếp trên server
  const res = await fetch('https://api.example.com/products');
  const products = await res.json();
  
  return (
    <div>
      <h1>Products</h1>
      {products.map(product => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
}

export default ProductsPage;`,
    contentType: "TEXT",
    createdAt: new Date(Date.now() - 3300000).toISOString(),
    senderName: "AI Tutor",
    isAI: true,
    isMe: false,
    type: "code",
    codeLanguage: "typescript",
    status: "read",
  },
];

/** =========================
 * Icons
 * =======================**/
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

const Send = (p: any) => (
  <IconBase {...p}>
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </IconBase>
);
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
const Phone = (p: any) => (
  <IconBase {...p}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </IconBase>
);
const Video = (p: any) => (
  <IconBase {...p}>
    <polygon points="23 7 16 12 23 17 23 7" />
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
  </IconBase>
);
const Info = (p: any) => (
  <IconBase {...p}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </IconBase>
);
const MoreVertical = (p: any) => (
  <IconBase {...p}>
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="19" r="1" />
  </IconBase>
);
const Paperclip = (p: any) => (
  <IconBase {...p}>
    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  </IconBase>
);
const ImageIcon = (p: any) => (
  <IconBase {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </IconBase>
);
const Smile = (p: any) => (
  <IconBase {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <line x1="9" y1="9" x2="9.01" y2="9" />
    <line x1="15" y1="9" x2="15.01" y2="9" />
  </IconBase>
);
const Check = (p: any) => (
  <IconBase {...p}>
    <polyline points="20 6 9 17 4 12" />
  </IconBase>
);
const CheckCheck = (p: any) => (
  <IconBase {...p}>
    <polyline points="20 6 9 17 4 12" />
    <polyline points="22 4 11 15" />
  </IconBase>
);
const ClockIcon = (p: any) => (
  <IconBase {...p}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </IconBase>
);
const UserPlus = (p: any) => (
  <IconBase {...p}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <line x1="20" y1="8" x2="20" y2="14" />
    <line x1="23" y1="11" x2="17" y2="11" />
  </IconBase>
);
const Trash = (p: any) => (
  <IconBase {...p}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </IconBase>
);

/** =========================
 * Component
 * =======================**/
export default function MessageComponent({
  embedded = false,
  className = "",
}: any) {
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = loadData("conversations", null);
    if (saved && saved.length > 0) return saved;
    const defaults = defaultConversations();
    saveData("conversations", defaults);
    saveData("messages:ai-1", defaultMessages());
    return defaults;
  });

  const [activeConversation, setActiveConversation] = useState<string>(() => {
    return loadData("activeConversation", "ai-1");
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const convId = loadData("activeConversation", "ai-1");
    const saved = loadData(`messages:${convId}`, []);
    return Array.isArray(saved)
      ? saved.filter((m: Message) => !m.isDeleted)
      : [];
  });
  const [chatFilter, setChatFilter] = useState<ChatFilter>("all");
  const [search, setSearch] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatType, setNewChatType] = useState<NewChatType>("ai");
  const [newChatName, setNewChatName] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);

  const emojiList = ["😀", "😂", "🥳", "🔥", "👍", "💡", "🎯", "✨", "❤️"];
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Load messages when conversation changes
  useEffect(() => {
    if (!activeConversation) return;
    const saved = loadData(`messages:${activeConversation}`, []);
    setMessages(saved.filter((m: Message) => !m.isDeleted));
  }, [activeConversation]);

  // Save conversations when changed
  useEffect(() => {
    if (conversations.length > 0) {
      saveData("conversations", conversations);
    }
  }, [conversations]);

  // Save messages when changed
  useEffect(() => {
    if (activeConversation && messages.length >= 0) {
      saveData(`messages:${activeConversation}`, messages);
    }
  }, [messages, activeConversation]);

  // Save active conversation
  useEffect(() => {
    if (activeConversation) {
      saveData("activeConversation", activeConversation);
    }
  }, [activeConversation]);

  const getActiveConversation = () =>
    conversations.find((c) => c.id === activeConversation);

  const getConversationIcon = (conv: Conversation) => {
    if (conv.type === "ai") return Bot;
    if (conv.type === "group") return Users;
    return User;
  };

  const getAvatarGradient = (conv: Conversation) => {
    if (conv.type === "ai") return "from-blue-500 to-purple-500";
    if (conv.type === "group") return "from-green-500 to-teal-500";
    if (conv.role === "teacher") return "from-orange-500 to-red-500";
    return "from-gray-500 to-gray-600";
  };

  const MessageStatus = ({ status }: any) => {
    if (!status) return null;
    switch (status) {
      case "sending":
        return <ClockIcon size={14} className="text-gray-400" />;
      case "sent":
        return <Check size={14} className="text-gray-400" />;
      case "delivered":
        return <CheckCheck size={14} className="text-gray-400" />;
      case "read":
        return <CheckCheck size={14} className="text-blue-500" />;
      default:
        return null;
    }
  };

  const formatTimestamp = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (minutes < 1) return "Vừa xong";
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;
    return date.toLocaleDateString("vi-VN");
  };

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const filteredConversations = useMemo(() => {
    return conversations
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
  }, [conversations, chatFilter, search]);

  const updateConversationLastMessage = (convId: string, msg: Message) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId
          ? {
              ...c,
              lastMessage:
                msg.type === "text"
                  ? msg.content || ""
                  : msg.type === "image"
                  ? `🖼️ ${msg.fileName || "image"}`
                  : msg.type === "file"
                  ? `📎 ${msg.fileName || "file"}`
                  : msg.type === "code"
                  ? "📄 Code snippet"
                  : "Tin nhắn mới",
              timestamp: new Date().toISOString(),
            }
          : c
      )
    );
  };

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    const tempId = `temp-${Date.now()}`;
    const newMsg: Message = {
      id: tempId,
      conversationId: activeConversation,
      senderUserId: "me",
      senderType: "USER",
      content: messageInput,
      contentType: "TEXT",
      createdAt: new Date().toISOString(),
      senderName: "Bạn",
      isMe: true,
      type: "text",
      status: "sending",
    };

    setMessages((prev) => [...prev, newMsg]);
    setMessageInput("");
    updateConversationLastMessage(activeConversation, newMsg);

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempId
            ? { ...m, id: `msg-${Date.now()}`, status: "sent" }
            : m
        )
      );
    }, 200);

    const conv = getActiveConversation();
    if (conv?.type === "ai") {
      setIsTyping(true);
      setTimeout(() => {
        const reply: Message = {
          id: `ai-${Date.now()}`,
          conversationId: activeConversation,
          senderUserId: "ai",
          senderType: "AI",
          content: "Đây là phản hồi demo từ AI. Tôi đã hiểu câu hỏi của bạn!",
          contentType: "TEXT",
          createdAt: new Date().toISOString(),
          senderName: conv.name,
          isAI: true,
          isMe: false,
          type: "text",
          status: "sent",
        };
        setMessages((prev) => [...prev, reply]);
        updateConversationLastMessage(activeConversation, reply);
        setIsTyping(false);
      }, 900);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    if (!confirm("Bạn có chắc muốn xóa tin nhắn này?")) return;

    setMessages((prev) => {
      const filtered = prev.filter((m) => m.id !== messageId);

      // Update last message in conversation
      if (filtered.length > 0) {
        const lastMsg = filtered[filtered.length - 1];
        updateConversationLastMessage(activeConversation, lastMsg);
      } else {
        setConversations((convs) =>
          convs.map((c) =>
            c.id === activeConversation
              ? {
                  ...c,
                  lastMessage: "Không có tin nhắn",
                  timestamp: new Date().toISOString(),
                }
              : c
          )
        );
      }

      return filtered;
    });
  };

  const openFilePicker = () => fileInputRef.current?.click();
  const openImagePicker = () => imageInputRef.current?.click();

  const handlePickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    const msg: Message = {
      id: `file-${Date.now()}`,
      conversationId: activeConversation,
      senderUserId: "me",
      senderType: "USER",
      content: null,
      contentType: "TEXT",
      createdAt: new Date().toISOString(),
      senderName: "Bạn",
      isMe: true,
      type: "file",
      status: "sent",
      fileName: f.name,
      fileUrl: url,
    };
    setMessages((prev) => [...prev, msg]);
    updateConversationLastMessage(activeConversation, msg);
    e.target.value = "";
  };

  const handlePickImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    const msg: Message = {
      id: `img-${Date.now()}`,
      conversationId: activeConversation,
      senderUserId: "me",
      senderType: "USER",
      content: null,
      contentType: "TEXT",
      createdAt: new Date().toISOString(),
      senderName: "Bạn",
      isMe: true,
      type: "image",
      status: "sent",
      fileUrl: url,
      fileName: f.name,
    };
    setMessages((prev) => [...prev, msg]);
    updateConversationLastMessage(activeConversation, msg);
    e.target.value = "";
  };

  const insertEmoji = (emoji: string) => {
    setMessageInput((s) => s + emoji);
    setShowEmoji(false);
  };

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      alert("Đã copy code vào clipboard");
    } catch {
      alert("Copy thất bại");
    }
  };

  const createNewChat = () => {
    const name =
      newChatName.trim() ||
      (newChatType === "ai" ? "AI Tutor mới" : "Cuộc trò chuyện mới");
    const id = `${newChatType}-${Date.now()}`;
    const conv: Conversation = {
      id,
      name,
      lastMessage: "Hãy bắt đầu cuộc trò chuyện!",
      timestamp: new Date().toISOString(),
      unreadCount: 0,
      isOnline: newChatType !== "group",
      isAI: newChatType === "ai",
      type: newChatType,
      participants: newChatType === "group" ? 1 : undefined,
      role: newChatType === "direct" ? "student" : undefined,
    };
    setConversations((prev) => [conv, ...prev]);
    saveData(`messages:${id}`, []);
    setMessages([]);
    setActiveConversation(id);
    setShowNewChatModal(false);
    setNewChatName("");
    setNewChatType("ai");
  };

  const activeConv = getActiveConversation();
  if (!activeConv) return null;

  return (
    <div
      className={`flex ${
        embedded ? "h-full" : "h-screen"
      } bg-gray-50 ${className}`}
    >
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-gray-900">Messages</h2>
            <button
              onClick={() => setShowNewChatModal(true)}
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

        <div className="flex-1 flex-1 overflow-y-auto chat-list-scroll-y-auto scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
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
                    <span className="text-xs text-gray-500">
                      {formatTimestamp(conv.timestamp)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate flex-1">
                      {conv.lastMessage}
                    </p>
                    {conv.unreadCount > 0 && (
                      <div className="ml-2 bg-blue-500 text-white text-xs font-bold rounded-full h-5 min-w-[20px] px-1.5 flex items-center justify-center">
                        {conv.unreadCount}
                      </div>
                    )}
                  </div>

                  {conv.type === "group" && (
                    <p className="text-xs text-gray-500 mt-1">
                      {conv.participants} thành viên
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col">
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
                <h3 className="font-semibold text-gray-900">
                  {activeConv.name}
                </h3>
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

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <p className="text-lg font-medium mb-2">Chưa có tin nhắn</p>
                <p className="text-sm">Hãy bắt đầu cuộc trò chuyện!</p>
              </div>
            </div>
          )}

          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex items-end max-w-2xl ${
                  m.isMe ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {!m.isMe && (
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      m.isAI
                        ? "bg-gradient-to-r from-blue-500 to-purple-500"
                        : "bg-gradient-to-r from-gray-400 to-gray-500"
                    } ${m.isMe ? "ml-2" : "mr-2"}`}
                  >
                    {m.isAI ? (
                      <Bot size={16} className="text-white" />
                    ) : (
                      <span className="text-white text-xs font-semibold">
                        {(m.senderName || "U")[0]}
                      </span>
                    )}
                  </div>
                )}

                <div className="group relative">
                  {!m.isMe && (
                    <p className="text-xs text-gray-500 mb-1 ml-2">
                      {m.senderName}
                    </p>
                  )}

                  {m.type === "text" && (
                    <div
                      className={`px-4 py-3 rounded-2xl shadow-sm ${
                        m.isMe
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                          : "bg-white border border-gray-200 text-gray-900"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {m.content}
                      </p>
                    </div>
                  )}

                  {m.type === "code" && (
                    <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg max-w-2xl">
                      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
                        <span className="text-xs text-gray-400 font-mono">
                          {m.codeLanguage || "code"}
                        </span>
                        <button
                          onClick={() => copyCode(m.content || "")}
                          className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          Copy
                        </button>
                      </div>
                      <pre className="p-4 overflow-x-auto">
                        <code className="text-sm text-gray-100 font-mono">
                          {m.content}
                        </code>
                      </pre>
                    </div>
                  )}

                  {m.type === "image" && m.fileUrl && (
                    <div className="rounded-lg overflow-hidden shadow-lg max-w-sm">
                      <img
                        src={m.fileUrl}
                        alt={m.fileName || "image"}
                        className="object-cover w-full h-auto"
                      />
                    </div>
                  )}

                  {m.type === "file" && (
                    <a
                      href={m.fileUrl}
                      download={m.fileName}
                      className="bg-white border border-gray-200 rounded-lg p-3 flex items-center space-x-3 shadow-sm hover:bg-gray-50"
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Paperclip size={20} className="text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {m.fileName || "File"}
                        </p>
                        <p className="text-xs text-gray-500">
                          Nhấn để tải xuống
                        </p>
                      </div>
                    </a>
                  )}

                  <div
                    className={`flex items-center mt-1 space-x-1 ${
                      m.isMe ? "justify-end" : "justify-start"
                    }`}
                  >
                    <span className="text-xs text-gray-500">
                      {formatTimestamp(m.createdAt)}
                    </span>
                    {m.isMe && <MessageStatus status={m.status} />}
                  </div>

                  <button
                    onClick={() => handleDeleteMessage(m.id)}
                    className={`absolute ${
                      m.isMe
                        ? "left-0 -translate-x-full ml-2"
                        : "right-0 translate-x-full mr-2"
                    } top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 rounded-md bg-red-500 hover:bg-red-600 text-white text-xs flex items-center gap-1`}
                    title="Xoá tin nhắn"
                  >
                    <Trash size={14} />
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-end">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mr-2">
                <Bot size={16} className="text-white" />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  />
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-end space-x-2">
            <div className="flex space-x-1">
              <button
                onClick={openFilePicker}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Đính kèm file"
              >
                <Paperclip size={20} className="text-gray-600" />
              </button>
              <button
                onClick={openImagePicker}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Gửi ảnh"
              >
                <ImageIcon size={20} className="text-gray-600" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                hidden
                onChange={handlePickFile}
              />
              <input
                ref={imageInputRef}
                type="file"
                hidden
                accept="image/*"
                onChange={handlePickImage}
              />
            </div>

            <div className="flex-1 relative">
              <textarea
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Nhập tin nhắn..."
                rows={1}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                style={{ minHeight: "44px", maxHeight: "120px" }}
              />
              <button
                onClick={() => setShowEmoji((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-lg transition-colors"
                title="Emoji"
              >
                <Smile size={20} className="text-gray-600" />
              </button>

              {showEmoji && (
                <div className="absolute right-0 bottom-12 bg-white border border-gray-200 rounded-xl shadow-lg p-2 grid grid-cols-9 gap-1 z-10">
                  {emojiList.map((e) => (
                    <button
                      key={e}
                      onClick={() => insertEmoji(e)}
                      className="text-xl hover:bg-gray-100 rounded-md px-1"
                    >
                      {e}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handleSendMessage}
              disabled={!messageInput.trim()}
              className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transform hover:scale-105 disabled:transform-none"
            >
              <Send size={20} />
            </button>
          </div>

          {activeConv.type === "ai" && (
            <div className="flex items-center space-x-2 mt-3 flex-wrap">
              <button
                onClick={() => alert("💡 Giải thích khái niệm")}
                className="text-xs px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
              >
                💡 Giải thích khái niệm
              </button>
              <button
                onClick={() => alert("📝 Tạo bài tập")}
                className="text-xs px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full hover:bg-purple-100 transition-colors"
              >
                📝 Tạo bài tập
              </button>
              <button
                onClick={() => alert("🔍 Code review")}
                className="text-xs px-3 py-1.5 bg-green-50 text-green-700 rounded-full hover:bg-green-100 transition-colors"
              >
                🔍 Code review
              </button>
              <button
                onClick={() => alert("🎯 Tạo quiz")}
                className="text-xs px-3 py-1.5 bg-orange-50 text-orange-700 rounded-full hover:bg-orange-100 transition-colors"
              >
                🎯 Tạo quiz
              </button>
            </div>
          )}
        </div>
      </div>

      {showNewChatModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                Tạo cuộc trò chuyện mới
              </h3>
              <button
                onClick={() => setShowNewChatModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loại cuộc trò chuyện
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setNewChatType("ai")}
                    className={`p-3 border-2 rounded-lg transition-colors ${
                      newChatType === "ai"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <Bot size={24} className="text-blue-600 mx-auto mb-1" />
                    <p className="text-xs font-medium text-blue-700">
                      AI Tutor
                    </p>
                  </button>
                  <button
                    onClick={() => setNewChatType("direct")}
                    className={`p-3 border-2 rounded-lg transition-colors ${
                      newChatType === "direct"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <User size={24} className="text-gray-600 mx-auto mb-1" />
                    <p className="text-xs font-medium text-gray-700">
                      1-1 Chat
                    </p>
                  </button>
                  <button
                    onClick={() => setNewChatType("group")}
                    className={`p-3 border-2 rounded-lg transition-colors ${
                      newChatType === "group"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <Users size={24} className="text-gray-600 mx-auto mb-1" />
                    <p className="text-xs font-medium text-gray-700">Nhóm</p>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên cuộc trò chuyện
                </label>
                <input
                  value={newChatName}
                  onChange={(e) => setNewChatName(e.target.value)}
                  type="text"
                  placeholder="Nhập tên..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowNewChatModal(false)}
                  className="flex-1 py-2 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={createNewChat}
                  className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-lg transition-all"
                >
                  Tạo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
