"use client";

import { useState } from "react";
import { Bot, User, Users, X } from "lucide-react";
const STORAGE_PREFIX = "msg";

type NewChatType = "ai" | "direct" | "group";
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

function NewMessageForm() {
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatType, setNewChatType] = useState<NewChatType>("ai");
  const [newChatName, setNewChatName] = useState("");
  const [messages, setMessages] = useState<Message[]>(() => {
    const convId = loadData("activeConversation", "ai-1");
    const saved = loadData(`messages:${convId}`, []);
    return Array.isArray(saved)
      ? saved.filter((m: Message) => !m.isDeleted)
      : [];
  });

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
      isOnline: newChatType !== "group",
      isAI: newChatType === "ai",
      type: newChatType,
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
  return (
    <>
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
    </>
  );
}

export default NewMessageForm;
