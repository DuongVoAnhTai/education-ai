"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

import { useSocket } from "@/context/SocketContext";
import { useAuth } from "@/context/AuthContext";
import * as Icon from "@/assets/Image";
import * as conversationService from "@/services/conversationServices";
import * as cloudinaryService from "@/services/cloudinaryServices";
import * as MessageHelper from "@/utils/messageHelper";

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
  const [stagedFile, setStagedFile] = useState<File | null>(null); // State mới để lưu file chờ
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openFilePicker = () => fileInputRef.current?.click();

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
  const handleSendMessage = async () => {
    if ((!messageInput.trim() && !stagedFile) || isSending) return;

    setIsSending(true);

    const textToSend = messageInput.trim();
    const fileToSend = stagedFile;

    setMessageInput("");
    setStagedFile(null);

    try {
      let uploadResult: any = null;

      // 1. Upload file nếu có
      if (fileToSend) {
        uploadResult = await cloudinaryService.uploadFile(
          fileToSend,
          "chat_attachments"
        );
      }

      // 2. Chuẩn bị payload tin nhắn
      if (uploadResult && socket) {
        const filePayload = {
          conversationId,
          contentType:
            uploadResult.resource_type === "image" ? "IMAGE" : "FILE",
          // Gửi kèm text nếu chỉ gửi file và không có text riêng
          content:
            textToSend && !fileToSend
              ? textToSend
              : `Tệp đính kèm: ${uploadResult.original_filename}`,
          fileUrl: uploadResult.secure_url,
          fileName: uploadResult.original_filename,
          fileSize: uploadResult.bytes,
        };
        socket.emit("send-message", filePayload, (ack: any) => {
          if (ack.error) toast.error(`Lỗi gửi tệp: ${ack.error}`);
        });
      }

      // 3. Gửi tin nhắn qua socket
      if (textToSend && socket) {
        const textPayload = {
          conversationId,
          contentType: "TEXT",
          content: textToSend,
        };
        socket.emit("send-message", textPayload, (ack: any) => {
          if (ack.error) toast.error(`Lỗi gửi tin nhắn: ${ack.error}`);
        });
      }
    } catch (err: any) {
      toast.error(err.message || "Gửi tin nhắn thất bại");
    } finally {
      setIsSending(false);
    }
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

  const handlePickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStagedFile(file);
    e.target.value = "";
  };

  const handleRemoveStagedFile = () => {
    setStagedFile(null);
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
      <div className="flex-1 overflow-y-auto p-4 flex flex-col">
        <div className="space-y-4">
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

            const renderMessageContent = () => {
              switch (msg.contentType) {
                // --- Case 1: IMAGE ---
                case "IMAGE":
                  return (
                    <a
                      href={msg.fileUrl!}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="rounded-lg overflow-hidden shadow-lg max-w-xs sm:max-w-sm cursor-pointer border border-gray-200">
                        <Image
                          src={msg.fileUrl!}
                          alt={msg.fileName || "image"}
                          width={300} // Cung cấp width/height để Next.js tối ưu hóa
                          height={300}
                          className="object-cover w-full h-auto"
                        />
                      </div>
                    </a>
                  );

                // --- Case 2: FILE ---
                case "FILE":
                  return (
                    <a
                      href={msg.fileUrl!}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={msg.fileName}
                      className={`bg-white border border-gray-200 rounded-lg p-3 flex items-center space-x-3 shadow-sm hover:bg-gray-50 max-w-xs ${
                        isMe ? "" : "text-gray-900"
                      }`}
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon.Paperclip size={20} className="text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {msg.fileName}
                        </p>
                        {msg.fileSize && (
                          <p className="text-xs text-gray-500">
                            {MessageHelper.formatFileSize(msg.fileSize)}
                          </p>
                        )}
                      </div>
                    </a>
                  );

                // --- Case 3 (Mặc định): TEXT ---
                default:
                  return (
                    <div
                      className={`px-4 py-3 rounded-2xl shadow-sm ${
                        isMe
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-900"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {msg.content}
                      </p>
                    </div>
                  );
              }
            };

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

                  <div className="group relative">
                    {!isMe && (
                      <p className="text-xs text-gray-500 mb-1 ml-2">
                        {msg.sender?.username}
                      </p>
                    )}

                    {/* Gọi hàm render để hiển thị đúng loại nội dung */}
                    {renderMessageContent()}

                    {/* có thể thêm phần hiển thị thời gian, status, nút xóa ở đây */}

                    <div
                      className={`flex items-center mt-1 space-x-1 text-xs text-gray-500 ${
                        isMe ? "justify-end" : "justify-start"
                      }`}
                    >
                      <span>
                        {MessageHelper.formatTimestamp(msg.createdAt)}
                      </span>
                      {/* {isMe && <MessageStatus status={msg.status} />} */}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Hiển thị ai đó đang gõ phím */}
        <div className="mt-auto flex-shrink-0">
          {typingUsers.length > 0 && (
            <div className="flex items-end">
              <div className="text-sm text-blue-500 italic">
                {typingUsers.map((u) => u.username).join(", ")} đang soạn tin...
              </div>
            </div>
          )}
        </div>

        <div ref={messagesEndRef} />
      </div>

      {/* Phần input tin nhắn */}
      <div className="bg-white border-t border-gray-200 p-4 flex-shrink-0">
        {stagedFile && (
          <div className="mb-2 p-2 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-between animate-in fade-in-50 pr-1 py-1 max-w-xs">
            <div className="flex items-center space-x-2 min-w-0">
              <div className="w-8 h-8 bg-gray-200 rounded-md flex items-center justify-center flex-shrink-0">
                <Icon.Paperclip size={16} className="text-gray-600" />
              </div>
              <span className="text-sm text-gray-800 truncate">
                {stagedFile.name}
              </span>
            </div>
            <button
              onClick={handleRemoveStagedFile}
              className="p-1 hover:bg-gray-300 rounded-full flex-shrink-0"
              title="Bỏ chọn tệp"
            >
              <Icon.X size={14} className="text-gray-700" />
            </button>
          </div>
        )}

        <div className="flex items-end space-x-2">
          {/* ... Các nút đính kèm file ... */}
          <button
            onClick={openFilePicker}
            disabled={isSending}
            className="w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer"
          >
            <Icon.Paperclip size={20} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            hidden
            onChange={handlePickFile}
          />

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
            disabled={(!messageInput.trim() && !stagedFile) || isSending}
            className="p-3 bg-blue-600 text-white rounded-full disabled:opacity-50 flex items-center justify-center w-[48px] h-[48px]"
          >
            {isSending ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Icon.Send size={20} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MessageComponent;
