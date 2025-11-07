"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

import { useSocket } from "@/context/SocketContext";
import { useAuth } from "@/context/AuthContext";
import * as Icon from "@/assets/Image";
import * as conversationService from "@/services/conversationServices";

interface MessageComponentProps {
  conversationId: string;
}

function MessageComponent({ conversationId }: MessageComponentProps) {
  const { socket } = useSocket();
  const { userDetail: fetchedUser } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<
    { userId: string; username: string }[]
  >([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- Hàm cuộn xuống tin nhắn cuối ---
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!conversationId) return;

    const fetchMessages = async () => {
      setLoading(true);
      setError(null);
      const result = await conversationService.getMessages(conversationId);

      if (result.error) {
        setError(result.error);
        toast.error(`Lỗi tải tin nhắn: ${result.error}`);
      } else if (result.messages) {
        setMessages(result.messages);
      }
      setLoading(false);
    };

    fetchMessages();
  }, [conversationId]);

  // --- XỬ LÝ SOCKET.IO ---
  useEffect(() => {
    if (!socket || !conversationId) return;

    // 1. Tham gia vào phòng chat
    socket.emit("join-room", { conversationId }, (response: any) => {
      if (response.error) {
        console.error("Không thể tham gia phòng:", response.error);
        toast.error(response.error);
      } else {
        console.log(`Đã tham gia phòng: ${conversationId}`);
      }
    });

    // 2. Lắng nghe tin nhắn mới
    const handleNewMessage = (newMessage: Message) => {
      // Chỉ thêm tin nhắn nếu nó thuộc về cuộc trò chuyện hiện tại
      if (newMessage.conversationId === conversationId) {
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    socket.on("new-message", handleNewMessage);

    // 3. Lắng nghe sự kiện gõ phím
    const handleUserTyping = (data: { userId: string; username: string }) => {
      if (data.userId !== fetchedUser?.id) {
        setTypingUsers((prev) => [
          ...prev.filter((u) => u.userId !== data.userId),
          data,
        ]);
        // Xóa user khỏi danh sách typing sau 3s
        setTimeout(() => {
          setTypingUsers((prev) =>
            prev.filter((u) => u.userId !== data.userId)
          );
        }, 3000);
      }
    };
    socket.on("user-typing", handleUserTyping);

    // Cleanup: rời phòng và tắt các listener
    return () => {
      socket.emit("leave-room", { conversationId });
      socket.off("new-message", handleNewMessage);
      socket.off("user-typing", handleUserTyping);
    };
  }, [socket, conversationId, fetchedUser?.id]);

  // --- Cuộn xuống khi có tin nhắn mới ---
  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUsers]);

  // --- GỬI TIN NHẮN ---
  const handleSendMessage = () => {
    if (!socket || !messageInput.trim()) return;

    // Gửi tin nhắn qua socket
    socket.emit(
      "send-message",
      { conversationId, content: messageInput.trim() },
      (response: { success?: boolean; error?: string; message?: Message }) => {
        if (response.error) {
          toast.error(`Lỗi gửi tin nhắn: ${response.error}`);
        } else if (response.success && response.message) {
          // Tin nhắn đã được server xác nhận, có thể cập nhật trạng thái
          // Hoặc chờ event `new-message` để đồng bộ hoàn toàn
        }
      }
    );

    setMessageInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    } else {
      // Gửi sự kiện typing
      if (socket) socket.emit("typing", { conversationId });
    }
  };

  // --- RENDER ---
  if (loading)
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  if (error)
    return (
      <div className="flex-1 flex items-center justify-center text-red-500">
        <p>{error}</p>
      </div>
    );

  return (
    <div className="h-full w-full flex flex-col bg-gray-50">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 && (
          <div className="flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p className="text-lg font-medium mb-2">Chưa có tin nhắn</p>
              <p className="text-sm">Hãy bắt đầu cuộc trò chuyện!</p>
            </div>
          </div>
        )}

        {messages.map((msg) => {
          const isMe = msg.sender?.id === fetchedUser?.id;
          return (
            <div
              key={msg.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex items-end max-w-2xl ${
                  isMe ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {!isMe &&
                  (msg.sender?.avatarUrl ? (
                    <Image
                      src={msg.sender?.avatarUrl}
                      alt={msg.sender?.username || "U"}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full mr-2"
                    />
                  ) : (
                    // Nếu người đó không có avatarUrl, hiển thị chữ cái đầu
                    <div className="w-8 h-8 mr-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-lg font-bold">
                        {msg.sender?.fullName?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                  ))}
                <div>
                  {!isMe && (
                    <p className="text-xs text-gray-500 mb-1 ml-2">
                      {msg.sender?.username}
                    </p>
                  )}
                  <div
                    className={`px-4 py-3 rounded-2xl shadow-sm ${
                      isMe ? "bg-blue-600 text-white" : "bg-white text-gray-900"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {msg.content}
                    </p>
                  </div>
                  {/* ... Hiển thị thời gian, status ... */}
                  <span className="text-xs text-gray-400">
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Hiển thị ai đó đang gõ phím */}
        {typingUsers.length > 0 && (
          <div className="flex items-end">
            <div className="text-sm text-blue-500 italic">
              {typingUsers.map((u) => u.username).join(", ")} đang soạn tin...
            </div>
          </div>
        )}

        {/* {messages.map((m) => (
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
                    <Icon.Bot size={16} className="text-white" />
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
                    <Image
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
                      <Icon.Paperclip size={20} className="text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {m.fileName || "File"}
                      </p>
                      <p className="text-xs text-gray-500">Nhấn để tải xuống</p>
                    </div>
                  </a>
                )}

                <div
                  className={`flex items-center mt-1 space-x-1 ${
                    m.isMe ? "justify-end" : "justify-start"
                  }`}
                >
                  <span className="text-xs text-gray-500">
                    {MessageHelper.formatTimestamp(m.createdAt)}
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
                  <Icon.Trash size={14} />
                  Xóa
                </button>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-end">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mr-2">
              <Icon.Bot size={16} className="text-white" />
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
        )} */}

        <div ref={messagesEndRef} />
      </div>

      {/* Phần input tin nhắn */}
      <div className="bg-white border-t border-gray-200 p-4 flex-shrink-0">
        <div className="flex items-end space-x-2">
          {/* ... Các nút đính kèm file ... */}
          <div className="flex-1 relative">
            <textarea
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Nhập tin nhắn..."
              rows={1}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl resize-none"
              style={{ minHeight: "44px", maxHeight: "120px" }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!messageInput.trim()}
            className="p-3 bg-blue-600 text-white rounded-full disabled:opacity-50"
          >
            <Icon.Send size={20} />
          </button>
        </div>
      </div>

      {/* <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-end space-x-2">
          <div className="flex space-x-1">
            <button
              onClick={openFilePicker}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Đính kèm file"
            >
              <Icon.Paperclip size={20} className="text-gray-600" />
            </button>
            <button
              onClick={openImagePicker}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Gửi ảnh"
            >
              <Icon.ImageIcon size={20} className="text-gray-600" />
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
              <Icon.Smile size={20} className="text-gray-600" />
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
      </div> */}
    </div>
  );
}

export default MessageComponent;
