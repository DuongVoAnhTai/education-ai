"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Award,
  BookOpen,
  MessageSquare,
  TrendingUp,
  UserIcon,
  X,
} from "lucide-react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: TrendingUp, path: "/" },
  { id: "skills", label: "Kỹ năng", icon: BookOpen, path: "/skills" },
  { id: "chat", label: "Chat", icon: MessageSquare, path: "/messages" },
  { id: "results", label: "Kết quả", icon: Award, path: "/results" },
  { id: "profile", label: "Hồ sơ", icon: UserIcon, path: "/profile" },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();

  return (
    <>
      {/* Sidebar overlay trên mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-br from-blue-900 to-purple-900 transform 
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        transition-transform duration-300 ease-in-out 
        lg:translate-x-0 lg:static lg:inset-0`}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 bg-black/20">
          <h1 className="text-xl font-bold text-white">Education Platform</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:text-gray-300"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-4">
          {navItems.map((item) => {
            const active =
              item.path === "/"
                ? pathname === "/"
                : pathname.startsWith(item.path);

            return (
              <Link
                key={item.id}
                href={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center w-full px-4 py-3 mt-2 rounded-lg transition-colors duration-200 
                  ${
                    active
                      ? "bg-white/20 text-white"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
              >
                <item.icon size={20} className="mr-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
