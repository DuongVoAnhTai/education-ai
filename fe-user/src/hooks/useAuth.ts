"use client";

import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import * as userService from "@/services/userServices";

type UserPayload = {
  userId: string;
  role: string;
  exp?: number; // thời gian hết hạn token
};

export function useAuth() {
  const [user, setUser] = useState<UserPayload | null>(null);
  const [userDetail, setUserDetail] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        // 🔑 Lấy token từ localStorage (hoặc cookie nếu bạn lưu ở server)
        const token = localStorage.getItem("token");
        if (token) {
          const decoded: UserPayload = jwtDecode(token);

          // Kiểm tra token hết hạn chưa
          if (decoded.exp && decoded.exp * 1000 < Date.now()) {
            logout(); // token hết hạn → xóa
          } else {
            setUser(decoded);
            const fetched = await userService.getUser();
            if (fetched) setUserDetail(fetched);
          }
        }
      } catch (error) {
        console.error("Invalid token", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    const decoded: UserPayload = jwtDecode(token);
    setUser(decoded);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setUserDetail(null);
  };

  const refreshUserDetail = async () => {
    try {
      const fetched = await userService.getUser();
      if (fetched) setUserDetail(fetched);
    } catch (error) {
      console.error("Refresh user detail failed:", error);
    }
  };

  const isAdmin = () => user?.role === "ADMIN";
  const isStudent = () => user?.role === "STUDENT";

  return {
    user,
    userDetail,
    login,
    logout,
    refreshUserDetail,
    isAdmin,
    isStudent,
    loading,
  };
}
