import Image from "next/image";
import * as messageHelper from "@/utils/messageHelper";

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  isLast?: boolean;
  currentUserId?: string;
  isUserOnline: (userId: string) => boolean;
  lastElementRef?: (node: HTMLDivElement) => void;
  onClick: (id: string) => void;
}

const ConversationItem = ({
  conversation: conv,
  isActive,
  isLast,
  currentUserId,
  isUserOnline,
  lastElementRef,
  onClick,
}: ConversationItemProps) => {
  // Lấy các giá trị được tính toán để render
  const type = messageHelper.getConversationType(conv);
  const name = messageHelper.getConversationName(conv, currentUserId);
  const lastMessage = conv.messages[0];
  const timestamp = lastMessage?.createdAt || conv.updatedAt.toString();
  const Icon = messageHelper.getConversationIcon(type);

  let otherParticipant = null;
  if (type === "direct") {
    otherParticipant = conv.participants.find(
      (p) => p.user.id !== currentUserId
    );
  }

  const otherUserRole = conv.participants.find(
    (p) => p.user.id !== currentUserId
  )?.user.role;

  const isOnline = otherParticipant
    ? isUserOnline(otherParticipant.user.id)
    : false;

  const containerProps = {
    onClick: () => onClick(conv.id),
    className: `flex items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
      isActive ? "bg-blue-50 border-l-4 border-blue-500" : ""
    }`,
    ...(isLast && { ref: lastElementRef }),
  };

  return (
    <div key={conv.id} {...containerProps}>
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
                {otherParticipant.user.fullName?.charAt(0).toUpperCase() || "U"}
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

        {/* Trạng thái online */}
        {isOnline && (
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
        )}
      </div>

      <div className="flex-1 ml-3 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-gray-900 truncate">{name}</h3>
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
};

export default ConversationItem;
