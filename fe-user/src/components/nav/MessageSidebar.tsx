"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { usePresence } from "@/context/PresenceContext";
import * as conversationService from "@/services/conversationServices";
import * as Icon from "@/assets/Image";
import * as messageHelper from "@/utils/messageHelper";

interface MessageSidebarProps {
  setShowNewChatModal: (show: boolean) => void;
}

const MessageSidebar = ({ setShowNewChatModal }: MessageSidebarProps) => {
  const [apiConversations, setApiConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [chatFilter, setChatFilter] = useState<ChatFilter>("all");
  const [search, setSearch] = useState("");
  const { userDetail: fetchedUser } = useAuth();

  const router = useRouter();
  const params = useParams();
  const activeConversationId = params.id as string;
  const { isUserOnline } = usePresence();

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
        if (!activeConversationId && result.conversations.length > 0) {
          router.push(`/messages/${result.conversations[0].id}`);
        }
      }
      setLoading(false);
    };

    fetchConversations();
  }, []);

  const handleConversationClick = (conversationId: string) => {
    // Chỉ điều hướng nếu click vào conversation khác
    if (conversationId !== activeConversationId) {
      router.push(`/messages/${conversationId}`);
    }
  };

  const filteredConversations = useMemo(() => {
    return apiConversations
      .filter((conv) => {
        const type = messageHelper.getConversationType(conv);
        return chatFilter === "all" ? true : type === chatFilter;
      })
      .filter((conv) => {
        if (!search.trim()) return true;
        const name = messageHelper.getConversationName(conv, fetchedUser?.id);
        return name.toLowerCase().includes(search.trim().toLowerCase());
      });
    // Việc sort đã được thực hiện ở API (orderBy: updatedAt), không cần sort lại ở client
  }, [apiConversations, chatFilter, search, fetchedUser]);

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
    <>
      {/* Sidebar */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-gray-900">Messages</h2>
          <button
            onClick={() => setShowNewChatModal(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <Icon.Plus size={20} className="text-gray-600" />
          </button>
        </div>

        <div className="relative mb-3">
          <Icon.Search
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
        {filteredConversations.length === 0 ? (
          <p className="p-4 text-center text-gray-500">
            Không tìm thấy cuộc trò chuyện nào.
          </p>
        ) : (
          filteredConversations.map((conv) => {
            // Lấy các giá trị đã được tính toán để render
            const type = messageHelper.getConversationType(conv);
            const name = messageHelper.getConversationName(
              conv,
              fetchedUser?.id
            );
            const lastMessage = conv.messages[0];
            const timestamp =
              lastMessage?.createdAt || conv.updatedAt.toString();
            const Icon = messageHelper.getConversationIcon(type);

            let otherParticipant = null;
            if (type === "direct") {
              otherParticipant = conv.participants.find(
                (p) => p.user.id !== fetchedUser?.id
              );
            }

            const otherUserRole = conv.participants.find(
              (p) => p.user.id !== fetchedUser?.id
            )?.user.role;

            const isOnline = otherParticipant
              ? isUserOnline(otherParticipant.user.id)
              : false;

            return (
              <div
                key={conv.id}
                onClick={() => handleConversationClick(conv.id)}
                className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  activeConversationId === conv.id
                    ? "bg-blue-50 border-l-4 border-blue-500"
                    : ""
                }`}
              >
                <div className="relative">
                  {/* Điều kiện 1: Nếu là chat 1-1 và tìm thấy người còn lại */}
                  {type === "direct" && otherParticipant ? (
                    otherParticipant.user.avatarUrl ? (
                      // Nếu người đó có avatarUrl
                      <Image
                        src={otherParticipant.user.avatarUrl}
                        alt={otherParticipant.user.fullName || "Avatar"}
                        width={44}
                        height={44}
                        className="w-11 h-11 rounded-full object-cover"
                      />
                    ) : (
                      // Nếu người đó không có avatarUrl, hiển thị chữ cái đầu
                      <div className="w-11 h-11 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-lg font-bold">
                          {otherParticipant.user.fullName
                            ?.charAt(0)
                            .toUpperCase() || "U"}
                        </span>
                      </div>
                    )
                  ) : (
                    /* Điều kiện 2: Fallback cho chat Nhóm hoặc AI */
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center bg-gradient-to-r ${messageHelper.getAvatarGradient(
                        type
                      )}`}
                    >
                      <Icon size={20} className="text-white" />
                    </div>
                  )}

                  {/* Logic hiển thị trạng thái online có thể thêm vào đây */}
                  {isOnline && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>

                <div className="flex-1 ml-3 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {name}
                      </h3>
                      {otherUserRole === "ADMIN" && (
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                          Teacher
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate flex-1">
                      {lastMessage?.content || "Bắt đầu cuộc trò chuyện"}
                    </p>
                    <span className="text-xs text-gray-500">
                      {messageHelper.formatTimestamp(timestamp)}
                    </span>
                  </div>

                  {type === "group" && (
                    <p className="text-xs text-gray-500 mt-1">
                      {conv.participants.length} thành viên
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
};

export default MessageSidebar;
