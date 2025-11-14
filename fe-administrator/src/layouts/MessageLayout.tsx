"use client";

import { useState } from "react";
import MessageSidebar from "@/components/nav/MessageSidebar";
import MessageTopbar from "@/components/nav/MessageTopbar";
import NewChatModal from "@/components/message/NewChatModal";
import { X } from "lucide-react";

interface MessageLayoutProps {
  embedded?: boolean;
  className?: string;
}

function MessageLayout({
  children,
  className = "",
}: { children: React.ReactNode } & MessageLayoutProps) {
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleConversationCreated = () => {
    // Khi hàm này được gọi, nó thay đổi state, khiến Sidebar re-render và fetch lại
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    // <div className="h-screen bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
    <div className={`h-full flex ${className}`}>
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
        {/* Sidebar */}
        <MessageSidebar
          refreshKey={refreshKey}
          setShowNewChatModal={setShowNewChatModal}
        />
      </div>

      {/* Content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <MessageTopbar />

        {/* Content */}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                Tạo cuộc trò chuyện mới
              </h3>
              <button
                onClick={() => setShowNewChatModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            <NewChatModal
              setShowNewChatModal={setShowNewChatModal}
              onConversationCreated={handleConversationCreated}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default MessageLayout;
