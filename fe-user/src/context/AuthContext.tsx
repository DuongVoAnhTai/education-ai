"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import * as userService from "@/services/userServices";

type UserPayload = {
  userId: string;
  role: string;
  exp?: number;
};

type AuthContextType = {
  userPayload: UserPayload | null;
  userDetail: User | null;
  loading: boolean;
  refreshUserDetail: () => Promise<void>;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userPayload, setUserPayload] = useState<UserPayload | null>(null);
  const [userDetail, setUserDetail] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const data = await userService.getUser();
      setUserDetail(data ?? null);
    } catch (e) {
      setUserDetail(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshUserDetail = async () => {
    await fetchUser();
  };

  const login = (token: string) => {
    localStorage.setItem("token", token);
    setUserPayload(jwtDecode(token));
    fetchUser();
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUserPayload(null);
    setUserDetail(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUserPayload(jwtDecode(token));
      fetchUser();
    } else setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        userPayload,
        userDetail,
        loading,
        refreshUserDetail,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
