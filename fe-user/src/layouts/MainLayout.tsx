"use client";

import { useState } from "react";
import Sidebar from "@/components/nav/Sidebar";
import Topbar from "@/components/nav/Topbar";

function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="flex-1 bg-gray-50 min-h-screen">
        <Topbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

export default MainLayout