"use client";

import MessageSidebar from "@/components/nav/MessageSidebar";
import MessageTopbar from "@/components/nav/MessageTopbar";

function MessageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      {/* Sidebar */}
      <MessageSidebar />

      {/* Content area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 min-h-screen">
        <MessageTopbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

export default MessageLayout;
