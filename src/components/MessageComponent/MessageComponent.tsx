"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import * as conversationService from "@/services/conversationServices";
import * as userService from "@/services/userServices";
import { useAuth } from "@/hooks/useAuth";

function MessagesComponent() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedUsers, setSearchedUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await conversationService.getConversations();
        if (res.error) {
          setError(res.error);
        } else {
          
          setConversations(res.conversations || []);
        }
      } catch (err) {
        setError("Failed to load conversations");
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (q.length < 2) return setSearchedUsers([]);

    try {
      const res = await userService.searchUsers(q);

      if (res?.users) {
        setSearchedUsers(res.users); // Giả sử response có { users: User[] }
      }
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  const handleCreate = async () => {
    if (!selectedUserId) return setCreateError("Please select a user");

    try {
      const res = await conversationService.createConversation(
        undefined,
        [selectedUserId],
        false,
        false
      );
      if (res.error) {
        if (res.existingConversationId) {
          alert(`Conversation already exists: ${res.existingConversationId}`);
        } else {
          setCreateError(res.error);
        }
      } else {
        // Refresh list
        const updated = await conversationService.getConversations();
        setConversations(updated.conversations || []);
        setShowModal(false);
        setSelectedUserId(null);
        setSearchQuery("");
        setSearchedUsers([]);
      }
    } catch (err) {
      setCreateError("Failed to create conversation");
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Conversations</h1>
      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        New 1-1 Chat
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Create New Chat</h2>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search user by username..."
              className="w-full border p-2 mb-4 rounded"
            />
            <ul className="space-y-2 max-h-40 overflow-y-auto">
              {searchedUsers.map((user) => (
                <li
                  key={user.id}
                  onClick={() => setSelectedUserId(user.id)}
                  className={`cursor-pointer p-2 rounded ${
                    selectedUserId === user.id ? "bg-blue-100" : ""
                  }`}
                >
                  <Image
                    src={
                      user.avatarUrl ||
                      "https://sevenpillarsinstitute.org/wp-content/uploads/2017/10/facebook-avatar-1.jpg"
                    }
                    alt="Avatar"
                    className="w-6 h-6 rounded-full inline mr-2"
                    width={100}
                    height={100}
                  />
                  {user.fullName}
                </li>
              ))}
            </ul>
            {createError && <p className="text-red-500 mt-2">{createError}</p>}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="mr-2 text-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
      <ul className="space-y-4">
        {conversations.map((conv) => {
          // Lấy tên hiển thị: Nếu 1-1, lấy username của participant khác (không phải AI)
          const otherParticipant = conv.participants.find(
            (p) => !p.isAi && p.userId !== user?.userId
          );
          const displayName =
            conv.title || otherParticipant?.user.fullName || "Untitled";

          // Last message
          const lastMessage = conv.messages[0]?.content || "No messages yet";

          return (
            <li
              key={conv.id}
              className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4"
            >
              <Image
                src={
                  otherParticipant?.user.avatarUrl ||
                  "https://sevenpillarsinstitute.org/wp-content/uploads/2017/10/facebook-avatar-1.jpg"
                }
                alt="Avatar"
                className="w-10 h-10 rounded-full"
                width={100}
                height={100}
              />
              <div className="flex-1">
                <h2 className="font-semibold">{displayName}</h2>
                <p className="text-gray-500 truncate">{lastMessage}</p>
              </div>
              <span className="text-sm text-gray-400">
                {new Date(conv.updatedAt).toLocaleTimeString()}
              </span>
            </li>
          );
        })}
      </ul>
      {conversations.length === 0 && (
        <p className="text-center text-gray-500">No conversations found.</p>
      )}
    </div>
  );
}

export default MessagesComponent;