'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import * as conversationService from '@/services/conversationServices';
import * as userService from '@/services/userServices';
import { useAuth } from '@/hooks/useAuth';

function MessagesComponent() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedUsers, setSearchedUsers] = useState<User[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [createError, setCreateError] = useState<string | null>(null);
  const [isGroupChat, setIsGroupChat] = useState(false);
  const [groupTitle, setGroupTitle] = useState('');
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
        setError('Failed to load conversations');
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (q.length < 2) {
      setSearchedUsers([]);
      return;
    }

    try {
      const res = await userService.searchUsers(q);
      if (res?.users) {
        setSearchedUsers(res.users);
      }
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleCreate = async () => {
    if (selectedUserIds.length === 0) {
      setCreateError('Please select at least one user');
      return;
    }

    try {
      const res = await conversationService.createConversation(
        isGroupChat ? groupTitle || undefined : undefined,
        selectedUserIds,
        isGroupChat,
        false
      );
      if (res.error) {
        if (res.existingConversationId) {
          alert(`Conversation already exists: ${res.existingConversationId}`);
          window.location.href = `messages-socket/${res.existingConversationId}`;
        } else {
          setCreateError(res.error);
        }
      } else {
        const updated = await conversationService.getConversations();
        setConversations(updated.conversations || []);
        setShowModal(false);
        setSelectedUserIds([]);
        setSearchQuery('');
        setSearchedUsers([]);
        setIsGroupChat(false);
        setGroupTitle('');
        window.location.href = `messages-socket/${res.conversation.id}`;
      }
    } catch (err) {
      setCreateError('Failed to create conversation');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Conversations</h1>
      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        New Chat
      </button>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Create New Chat</h2>
            <label className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={isGroupChat}
                onChange={(e) => setIsGroupChat(e.target.checked)}
                className="mr-2"
              />
              Group Chat
            </label>
            {isGroupChat && (
              <input
                type="text"
                value={groupTitle}
                onChange={(e) => setGroupTitle(e.target.value)}
                placeholder="Group name (optional)"
                className="w-full border p-2 mb-4 rounded"
              />
            )}
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
                  onClick={() => handleSelectUser(user.id)}
                  className={`cursor-pointer p-2 rounded ${
                    selectedUserIds.includes(user.id) ? 'bg-blue-100' : ''
                  }`}
                >
                  <Image
                    src={user.avatarUrl || 'https://sevenpillarsinstitute.org/wp-content/uploads/2017/10/facebook-avatar-1.jpg'}
                    alt="Avatar"
                    className="w-6 h-6 rounded-full inline mr-2"
                    width={24}
                    height={24}
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
          const otherParticipant = conv.participants.find(
            (p) => !p.isAi && p.userId !== user?.userId
          );
          const displayName = conv.isGroup
            ? conv.title || `Group with ${conv.participants.length} members`
            : otherParticipant?.user.fullName || 'Untitled';
          const lastMessage = conv.messages[0]?.content || 'No messages yet';

          return (
            <li
              key={conv.id}
              className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4 cursor-pointer"
              onClick={() => window.location.href = `messages-socket/${conv.id}`}
            >
              <Image
                src={otherParticipant?.user.avatarUrl || 'https://sevenpillarsinstitute.org/wp-content/uploads/2017/10/facebook-avatar-1.jpg'}
                alt="Avatar"
                className="w-10 h-10 rounded-full"
                width={40}
                height={40}
              />
              <div className="flex-1">
                <h2 className="font-semibold">{displayName}</h2>
                <p className="text-gray-500 truncate text-sm">{lastMessage}</p>
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