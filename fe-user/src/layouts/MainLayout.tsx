"use client";

import { useState } from "react";
import Sidebar from "@/components/nav/MainSidebar";
import Topbar from "@/components/nav/MainTopbar";

function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 min-h-screen">
        <Topbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

export default MainLayout