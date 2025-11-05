"use client";

import { useEffect, useState } from "react";
import { Bot, Loader2, User, Users, X } from "lucide-react";
import { toast } from "react-toastify";
import useDebounce from "@/hooks/useDebounce";
import * as userService from "@/services/userServices";
import * as conversationService from "@/services/conversationServices";
import Image from "next/image";

interface NewChatModalProps {
  setShowNewChatModal: (show: boolean) => void;
  onConversationCreated: () => void;
}

function NewChatModal({
  setShowNewChatModal,
  onConversationCreated,
}: NewChatModalProps) {
  const [newChatType, setNewChatType] = useState<"ai" | "direct" | "group">(
    "ai"
  );
  // State for Group Chat
  const [groupName, setGroupName] = useState("");

  // State for User Search & Selection
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  // State for Loading & Submission
  const [isSearching, setIsSearching] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Effect for searching users
  useEffect(() => {
    if (debouncedSearchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const search = async () => {
      setIsSearching(true);
      const res = await userService.searchUsers(debouncedSearchQuery);
      if (res && res.users) {
        // Lọc ra những user đã được chọn
        const newResults = res.users.filter(
          (user) => !selectedUsers.some((selected) => selected.id === user.id)
        );
        setSearchResults(newResults);
      }
      setIsSearching(false);
    };

    search();
  }, [debouncedSearchQuery, selectedUsers]);

  // --- User Selection Handlers ---
  const handleSelectUser = (user: User) => {
    if (newChatType === "direct") {
      setSelectedUsers([user]); // Chat 1-1 chỉ cho phép 1 người
    } else {
      setSelectedUsers((prev) => [...prev, user]);
    }
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers((prev) => prev.filter((user) => user.id !== userId));
  };

  // --- Create Conversation Handler ---
  const handleCreateConversation = async () => {
    setIsCreating(true);

    let result;

    try {
      if (newChatType === "ai") {
        result = await conversationService.createConversation(
          "AI Tutor",
          [],
          false,
          true
        );
      } else if (newChatType === "direct") {
        if (selectedUsers.length !== 1) {
          toast.error(
            "Vui lòng chọn một người dùng để bắt đầu cuộc trò chuyện."
          );
          return;
        }
        result = await conversationService.createConversation(
          undefined,
          [selectedUsers[0].id],
          false,
          false
        );
      } else if (newChatType === "group") {
        if (!groupName.trim()) {
          toast.error("Vui lòng nhập tên nhóm.");
          return;
        }
        if (selectedUsers.length < 1) {
          toast.error("Vui lòng chọn ít nhất một thành viên cho nhóm.");
          return;
        }
        const participantIds = selectedUsers.map((user) => user.id);
        result = await conversationService.createConversation(
          groupName,
          participantIds,
          true,
          false
        );
      }

      if (result && result.conversation) {
        toast.success("Tạo cuộc trò chuyện thành công!");
        onConversationCreated(); // Gọi lại hàm để refresh sidebar
        setShowNewChatModal(false);
      } else if (result && result.error) {
        // Xử lý trường hợp chat 1-1 đã tồn tại
        if (result.existingConversationId) {
          toast.info("Cuộc trò chuyện đã tồn tại.");
          // Có thể chuyển hướng người dùng đến cuộc trò chuyện đó
        } else {
          toast.error(result.error);
        }
      } else {
        toast.error("Đã có lỗi xảy ra.");
      }
    } catch (error) {
      toast.error("Không thể tạo cuộc trò chuyện.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Loại cuộc trò chuyện
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setNewChatType("ai")}
            className={`p-3 border-2 rounded-lg transition-colors cursor-pointer ${
              newChatType === "ai"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            <Bot size={24} className="text-blue-600 mx-auto mb-1" />
            <p className="text-xs font-medium text-blue-700">AI Tutor</p>
          </button>
          <button
            onClick={() => setNewChatType("direct")}
            className={`p-3 border-2 rounded-lg transition-colors cursor-pointer ${
              newChatType === "direct"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            <User size={24} className="text-gray-600 mx-auto mb-1" />
            <p className="text-xs font-medium text-gray-700">1-1 Chat</p>
          </button>
          <button
            onClick={() => setNewChatType("group")}
            className={`p-3 border-2 rounded-lg transition-colors cursor-pointer ${
              newChatType === "group"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            <Users size={24} className="text-gray-600 mx-auto mb-1" />
            <p className="text-xs font-medium text-gray-700">Nhóm</p>
          </button>
        </div>
      </div>

      {newChatType === "group" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tên nhóm
          </label>
          <input
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            type="text"
            placeholder="Nhập tên nhóm trò chuyện..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {(newChatType === "direct" || newChatType === "group") && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {newChatType === "direct"
              ? "Tìm kiếm người dùng"
              : "Thêm thành viên"}
          </label>

          {/* Selected Users Pills */}
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedUsers.map((user) => (
              <div
                key={user.id}
                className="bg-blue-100 text-blue-800 flex items-center gap-2 pl-3 pr-1 py-1 rounded-full"
              >
                <span className="text-sm font-medium">{user.fullName}</span>
                <button
                  onClick={() => handleRemoveUser(user.id)}
                  className="hover:bg-blue-200 rounded-full p-0.5 cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* Search Input and Results */}
          <div className="relative">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
              placeholder="Tìm theo tên hoặc email..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              // Vô hiệu hóa input nếu là chat 1-1 và đã chọn 1 người
              disabled={newChatType === "direct" && selectedUsers.length === 1}
            />
            {isSearching && (
              <Loader2
                className="animate-spin absolute right-3 top-2.5 text-gray-400"
                size={20}
              />
            )}

            {/* Search Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                <ul>
                  {searchResults.map((user) => (
                    <li
                      key={user.id}
                      onClick={() => handleSelectUser(user)}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer"
                    >
                      <Image
                        src={user.avatarUrl || "/default-avatar.png"}
                        alt={user.fullName || ""}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-gray-800">
                          {user.fullName}
                        </p>
                        <p className="text-xs text-gray-500">{user.role}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ... Action Buttons ... */}
      <div className="flex space-x-3 pt-4">
        <button
          onClick={() => setShowNewChatModal(false)}
          disabled={isCreating}
          className="flex-1 py-2 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
        >
          Hủy
        </button>
        <button
          onClick={handleCreateConversation}
          disabled={isCreating}
          className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-lg transition-all cursor-pointer"
        >
          {isCreating ? <Loader2 className="animate-spin" /> : "Tạo"}
        </button>
      </div>
    </div>
  );
}

export default NewChatModal;
