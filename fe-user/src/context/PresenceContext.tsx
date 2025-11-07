"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { useSocket } from "./SocketContext";

interface IPresenceContext {
  onlineUserIds: Set<string>;
  isUserOnline: (userId: string) => boolean;
}

const PresenceContext = createContext<IPresenceContext>({
  onlineUserIds: new Set(),
  isUserOnline: () => false,
});

export const usePresence = () => {
  return useContext(PresenceContext);
};

export const PresenceProvider = ({ children }: { children: ReactNode }) => {
  const { socket } = useSocket();
  const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!socket) return;

    // 1. Lấy danh sách online ban đầu
    socket.emit("get-online-users");

    // 2. Lắng nghe các sự kiện
    const handleOnlineList = (userIds: string[]) => {
      setOnlineUserIds(new Set(userIds));
    };
    const handleUserOnline = ({ userId }: { userId: string }) => {
      setOnlineUserIds((prev) => new Set(prev).add(userId));
    };
    const handleUserOffline = ({ userId }: { userId: string }) => {
      setOnlineUserIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    };

    socket.on("online-users-list", handleOnlineList);
    socket.on("user-online", handleUserOnline);
    socket.on("user-offline", handleUserOffline);

    // Cleanup
    return () => {
      socket.off("online-users-list", handleOnlineList);
      socket.off("user-online", handleUserOnline);
      socket.off("user-offline", handleUserOffline);
    };
  }, [socket]);

  const isUserOnline = useCallback(
    (userId: string) => {
      return onlineUserIds.has(userId);
    },
    [onlineUserIds]
  );

  return (
    <PresenceContext.Provider value={{ onlineUserIds, isUserOnline }}>
      {children}
    </PresenceContext.Provider>
  );
};
