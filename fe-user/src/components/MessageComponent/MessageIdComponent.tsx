"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { debounce } from "lodash";
import { useSocket } from "@/hooks/useSocket";
import * as conversationService from "@/services/conversationServices";
import * as userService from "@/services/userServices";

function MessageIdComponent({ id }: { id: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [typingUsers, setTypingUsers] = useState<
    { userId: string; username: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [conversation, setConversation] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";
  const {
    socket,
    joinRoom,
    sendMessage: socketSendMessage,
    sendTyping,
    onNewMessage,
  } = useSocket(token);

  // Debounce sendTyping để tránh spam server
  const debouncedSendTyping = useRef(
    debounce((conversationId: string) => {
      sendTyping(conversationId);
    }, 500)
  ).current;

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      const user = await userService.getUser();
      if (user) setCurrentUser(user);
    };
    fetchUser();
  }, []);

  // Fetch conversation details
  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const res = await conversationService.getConversations();
        if (res.error) {
          setError(res.error);
        } else {
          setConversation(res.conversation);
        }
      } catch (err) {
        setError("Failed to load conversation");
      }
    };

    fetchConversation();
  }, [id]);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await conversationService.getMessages(id);
        if (res.error) {
          setError(res.error);
        } else {
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

  // Join room
  useEffect(() => {
    if (!token || !id || !socket) return;

    joinRoom(id);

    return () => {
      // Optional: Rời room khi component unmount
      if (socket && socket.connected) {
        socket.emit("leave-room", { conversationId: id });
      }
    };
  }, [id, token, socket, joinRoom]);

  // Listen for new messages and typing
  useEffect(() => {
    if (!socket || !currentUser) return;

    const handleNewMessage = (message: Message) => {
      setMessages((prev) => {
        if (prev.some((msg) => msg.id === message.id)) {
          return prev;
        }
        return [...prev, message];
      });
    };

    const handleTyping = ({
      userId,
      username,
    }: {
      userId: string;
      username: string;
    }) => {
      if (userId === currentUser.id) return;
      setTypingUsers((prev) => {
        if (prev.some((u) => u.userId === userId)) return prev;
        return [...prev, { userId, username }];
      });

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        setTypingUsers((prev) => prev.filter((u) => u.userId !== userId));
      }, 3000);
    };

    onNewMessage(handleNewMessage);
    socket.on("user-typing", handleTyping);

    return () => {
      onNewMessage(handleNewMessage);
      socket.off("user-typing", handleTyping);
    };
  }, [socket, currentUser, onNewMessage]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle input change and emit typing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    if (e.target.value.trim() && token && id && socket) {
      debouncedSendTyping(id);
    }
  };

  // Handle send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      socketSendMessage(id, newMessage.trim(), (response) => {
        if (response.error) {
          console.error("Socket send message error:", response.error);
          // Remove temp message if error
          setMessages((prev) => prev.filter((msg) => msg.id !== id));
        } else {
          console.log("Socket send success");
          setNewMessage("");
        }
      });
    } catch (err) {
      setError("Failed to send message");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }
  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4 h-screen flex flex-col">
      <h1 className="text-2xl font-bold mb-4">
        {conversation?.isGroup
          ? conversation.title ||
            `Group with ${conversation.participants.length} members`
          : conversation?.participants.find(
              (p: any) => !p.isAi && p.userId !== currentUser?.id
            )?.user.fullName || "Conversation"}
      </h1>
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
                    width={24}
                    height={24}
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
        {typingUsers.length > 0 && (
          <p className="text-gray-500 text-sm italic">
            {typingUsers.map((u) => u.username).join(", ")}{" "}
            {typingUsers.length > 1 ? "are" : "is"} typing...
          </p>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="mt-4 flex space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={handleInputChange}
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
