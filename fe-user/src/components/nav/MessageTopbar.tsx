"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import * as Icon from "@/assets/Image";
import * as conversationService from "@/services/conversationServices";
import * as messageHelper from "@/utils/messageHelper";

interface MessageTopbarProps {
  activeConversationId: string | null;
}

const MessageTopbar = ({ activeConversationId }: MessageTopbarProps) => {
  const [activeConversation, setActiveConversation] =
    useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const { userDetail: fetchedUser } = useAuth();

  useEffect(() => {
    // Nếu không có conversation nào được chọn, reset state
    if (!activeConversationId) {
      setActiveConversation(null);
      setLoading(false);
      return;
    }

    const fetchConversationDetails = async () => {
      setLoading(true);

      const result = await conversationService.getConversationById(
        activeConversationId
      );

      if (result.error) {
        console.error(result.error);
        setActiveConversation(null);
      } else {
        setActiveConversation(result.conversation);
      }

      setLoading(false);
    };

    fetchConversationDetails();
  }, [activeConversationId]); // Chạy lại mỗi khi ID active thay đổi

  // Render trạng thái loading
  if (loading) {
    return (
      <div className="bg-white border-b border-gray-200 p-4 h-[77px] flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
        <div className="space-y-2">
          <div className="w-32 h-4 rounded bg-gray-200 animate-pulse"></div>
          <div className="w-24 h-3 rounded bg-gray-200 animate-pulse"></div>
        </div>
      </div>
    );
  }

  // Render khi không có conversation nào được chọn
  if (!activeConversation) {
    return (
      <div className="bg-white border-b border-gray-200 p-4 h-[77px] flex items-center">
        <p className="text-gray-500">Chọn một cuộc trò chuyện để bắt đầu</p>
      </div>
    );
  }

  // Lấy các thông tin cần thiết từ conversation thật
  const type = messageHelper.getConversationType(activeConversation);
  const name = messageHelper.getConversationName(
    activeConversation,
    fetchedUser?.id
  );
  const otherParticipant =
    type === "direct"
      ? activeConversation.participants.find(
          (p) => p.user.id !== fetchedUser?.id
        )
      : null;

  return (
    <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
      <div className="flex items-center">
        {/* Logic hiển thị Avatar thật */}
        <div className="relative">
          {type === "direct" && otherParticipant ? (
            otherParticipant.user.avatarUrl ? (
              <Image
                src={otherParticipant.user.avatarUrl}
                alt={name}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">
                  {name.charAt(0).toUpperCase()}
                </span>
              </div>
            )
          ) : (
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500`}
            >
              <Icon.User size={20} className="text-white" />
            </div>
          )}
        </div>

        <div className="ml-3">
          <h3 className="font-semibold text-gray-900">{name}</h3>
          <p className="text-sm text-gray-500">
            {type === "group"
              ? `${activeConversation.participants.length} thành viên`
              : // Logic isOnline sẽ cần cập nhật sau với WebSocket/Pusher
                "Đang hoạt động"}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {type !== "ai" && (
          <>
            <button
              onClick={() => alert("📞 Demo gọi thoại")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Icon.Phone size={20} className="text-gray-600" />
            </button>
            <button
              onClick={() => alert("🎥 Demo video call")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Icon.Video size={20} className="text-gray-600" />
            </button>
          </>
        )}
        {type === "group" && (
          <button
            onClick={() => alert("➕ Thêm thành viên")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Icon.UserPlus size={20} className="text-gray-600" />
          </button>
        )}
        <button
          onClick={() => alert("ℹ️ Thông tin hội thoại")}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Icon.Info size={20} className="text-gray-600" />
        </button>
        <button
          onClick={() => alert("⋮ Menu thêm")}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Icon.MoreVertical size={20} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default MessageTopbar;
