"use client";

import { useState } from "react";
import Image from "next/image";
import { Bell, Menu, Search, X, Info } from "lucide-react";

interface TopbarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void;
  currentUser?: User; // nhận user từ props nếu đã đăng nhập
}

const Topbar = ({ sidebarOpen, setSidebarOpen, currentUser }: TopbarProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const defaultAvatar =
    "https://sevenpillarsinstitute.org/wp-content/uploads/2017/10/facebook-avatar-1.jpg";

  // Thông báo mẫu
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: "n1",
      title: "Cập nhật kỹ năng mới",
      message: "Đã thêm bài học AI nâng cao.",
      date: "2025-10-15",
      type: "info",
    },
    {
      id: "n2",
      title: "Hoàn thành bài kiểm tra",
      message: "Bạn vừa hoàn thành bài NLP #1.",
      date: "2025-10-10",
      type: "success",
    },
  ]);

  const user: User = currentUser ?? {
    id: "1",
    email: "student@example.com",
    fullName: "Học viên",
    username: "student01",
    role: "student",
    avatarUrl: null,
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4 relative">
        {/* Left */}
        <div className="flex items-center">
          {/* Nút mở sidebar */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-gray-600 hover:text-gray-900 mr-4"
          >
            <Menu size={24} />
          </button>

          {/* Ô tìm kiếm */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              type="text"
              placeholder="Tìm kiếm kỹ năng, bài học..."
              className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen((s) => !s)}
              className="relative p-2 text-gray-600 hover:text-gray-900"
            >
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notifications.length}
              </span>
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg p-3 z-10">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-gray-900">Thông báo</p>
                  <button
                    onClick={() => setNotifOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-2 max-h-72 overflow-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50"
                    >
                      <Info size={18} className="text-blue-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {n.title}
                        </p>
                        <p className="text-xs text-gray-600">{n.message}</p>
                        <p className="text-[11px] text-gray-400">{n.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User info */}
          <div className="flex items-center space-x-2">
            {user.avatarUrl ? (
              <Image
                src={user.avatarUrl || defaultAvatar}
                alt="avatar"
                width={32}
                height={32}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
            )}
            <span className="text-sm font-medium text-gray-700">
              {user.fullName ?? user.username ?? "Người dùng"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
