"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useSocket } from "@/hooks/useSocket";
import * as conversationService from "@/services/conversationServices";
import * as userService from "@/services/userServices";

function MessageIdComponent({ id }: { id: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";

  // Khởi tạo Socket.io
  const {
    joinRoom,
    sendMessage: socketSendMessage,
    onNewMessage,
  } = useSocket(token);

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      const user = await userService.getUser();
      if (user) setCurrentUser(user);
    };
    fetchUser();
  }, []);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await conversationService.getMessages(id);
        if (res.error) {
          setError(res.error);
        } else {
          // Lọc trùng lặp dựa trên id
          const uniqueMessages = Array.from(
            new Map(res.messages.map((msg: Message) => [msg.id, msg])).values()
          ) as Message[];
          setMessages(uniqueMessages);
        }
      } catch (err) {
        setError("Failed to load messages");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [id]);

  // Join room and listen for new messages
  useEffect(() => {
    if (!token || !id) return;

    joinRoom(id);

    const handleNewMessage = (message: Message) => {
      setMessages((prev) => {
        // Kiểm tra xem tin nhắn đã tồn tại chưa
        if (prev.some((msg) => msg.id === message.id)) {
          return prev; // Bỏ qua nếu trùng
        }
        return [...prev, message];
      });
    };

    onNewMessage(handleNewMessage);

    return () => {
      onNewMessage(handleNewMessage); // Cleanup listener
    };
  }, [id, token, joinRoom, onNewMessage]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const res = await conversationService.sendMessage(
        id,
        newMessage.trim(),
        "TEXT",
        "USER"
      );

      if (res.error) {
        setError(res.error);
      } else {
        // Gửi qua Socket.io
        socketSendMessage(id, newMessage.trim(), (response) => {
          if (response.error) {
            console.error("Socket send message error:", response.error);
          }
        });
        setNewMessage("");
      }
    } catch (err) {
      setError("Failed to send message");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="container mx-auto p-4 h-screen flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Conversation</h1>
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100 rounded-lg">
        {messages.length === 0 && (
          <p className="text-center text-gray-500">No messages yet.</p>
        )}
        {messages.map((msg) => {
          const isOwnMessage = currentUser && msg.sender.id === currentUser.id;
          return (
            <div
              key={msg.id}
              className={`mb-4 flex ${
                isOwnMessage ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs md:max-w-md p-3 rounded-lg ${
                  isOwnMessage ? "bg-blue-500 text-white" : "bg-white shadow"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Image
                    src={
                      msg.sender.avatarUrl ||
                      "https://sevenpillarsinstitute.org/wp-content/uploads/2017/10/facebook-avatar-1.jpg"
                    }
                    alt="Avatar"
                    className="w-6 h-6 rounded-full"
                    width={100}
                    height={100}
                  />
                  <span className="font-semibold">{msg.sender.username}</span>
                </div>
                <p>{msg.content}</p>
                <span className="text-xs text-gray-400">
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="mt-4 flex space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default MessageIdComponent;
