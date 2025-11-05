"use client";

import { useState } from "react";
import MessageSidebar from "@/components/nav/MessageSidebar";
import MessageTopbar from "@/components/nav/MessageTopbar";
import NewChatModal from "@/components/message/NewChatModal";

function MessageLayout({ children }: { children: React.ReactNode }) {
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleConversationCreated = () => {
    // Khi hàm này được gọi, nó thay đổi state, khiến Sidebar re-render và fetch lại
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <MessageSidebar
        key={refreshKey}
        setShowNewChatModal={setShowNewChatModal}
      />

      {/* Content area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 min-h-screen">
        <MessageTopbar />
        <main className="p-6">{children}</main>
        {showNewChatModal && (
          <NewChatModal
            setShowNewChatModal={setShowNewChatModal}
            onConversationCreated={handleConversationCreated}
          />
        )}
      </div>
    </div>
  );
}

export default MessageLayout;
