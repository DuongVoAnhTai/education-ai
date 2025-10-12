"use client";

import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

type UserPayload = {
  userId: string;
  role: string;
  exp?: number; // thời gian hết hạn token
};

export function useAuth() {
  const [user, setUser] = useState<UserPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        }
      }
    } catch (error) {
      console.error("Invalid token", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    const decoded: UserPayload = jwtDecode(token);
    setUser(decoded);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const isAdmin = () => user?.role === "ADMIN";
  const isStudent = () => user?.role === "STUDENT";

  return { user, login, logout, isAdmin, isStudent, loading };
}
