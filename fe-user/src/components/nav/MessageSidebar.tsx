"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { usePresence } from "@/context/PresenceContext";
import ConversationItem from "./ConversationItem";
import * as conversationService from "@/services/conversationServices";
import * as Icon from "@/assets/Image";
import * as messageHelper from "@/utils/messageHelper";

interface MessageSidebarProps {
  refreshKey?: number;
  setShowNewChatModal: (show: boolean) => void;
}

const MessageSidebar = ({
  refreshKey,
  setShowNewChatModal,
}: MessageSidebarProps) => {
  const [apiConversations, setApiConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

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
      const result = await conversationService.getConversations({ take: 20 });

      if (result.error) {
        setError(result.error);
        console.error("Failed to fetch conversations:", result.error);
      } else if (result && result.conversations) {
        setApiConversations(result.conversations);
        setNextCursor(result.nextCursor);
        // Set conversation đầu tiên làm active nếu chưa có
        if (!activeConversationId && result.conversations.length > 0) {
          router.push(`/messages/${result.conversations[0].id}`);
        }
      }
      setLoading(false);
    };

    fetchConversations();
  }, [refreshKey]);

  const handleConversationClick = (conversationId: string) => {
    // Chỉ điều hướng nếu click vào conversation khác
    if (conversationId !== activeConversationId) {
      router.push(`/messages/${conversationId}`);
    }
  };

  const loadMoreConversations = useCallback(async () => {
    if (loadingMore || !nextCursor) return;
    setLoadingMore(true);

    const result = await conversationService.getConversations({
      take: 20,
      cursor: nextCursor,
    });

    if (result && result.conversations) {
      setApiConversations((prev) => [...prev, ...result.conversations]);
      setNextCursor(result.nextCursor);
    }
    setLoadingMore(false);
  }, [loadingMore, nextCursor]);

  const lastConversationElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading || loadingMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        // Chỉ fetch khi có cursor tiếp theo
        if (entries[0].isIntersecting && nextCursor) {
          loadMoreConversations();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, loadingMore, nextCursor, loadMoreConversations]
  );

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
          filteredConversations.map((conv, index) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              isActive={activeConversationId === conv.id}
              isLast={filteredConversations.length === index + 1}
              currentUserId={fetchedUser?.id}
              isUserOnline={isUserOnline}
              lastElementRef={
                filteredConversations.length === index + 1
                  ? lastConversationElementRef
                  : undefined
              }
              onClick={handleConversationClick}
            />
          ))
        )}
        {/* Icon Loading chỉ hiện khi đang fetch và có trang tiếp theo */}
        {loadingMore && (
          <div className="flex justify-center items-center p-4">
            <Loader2 className="animate-spin text-gray-400" />
          </div>
        )}
      </div>
    </>
  );
};

export default MessageSidebar;
