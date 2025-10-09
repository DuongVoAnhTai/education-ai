import { useCallback, useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";

interface SocketResponse {
  success?: boolean;
  error?: string;
  message?: any;
}

export const useSocket = (token: string) => {
  const socketRef = useRef<typeof Socket | null>(null);

  useEffect(() => {
    if (!token) return;

    socketRef.current = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000",
      {
        auth: { token },
      }
    );

    socketRef.current.on("connect", () => console.log("Socket connected"));
    socketRef.current.on("connect_error", (err: Error) => {
      console.error("Connection error:", err);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [token]);

  const joinRoom = useCallback((conversationId: string) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit(
        "join-room",
        { conversationId },
        (response: SocketResponse) => {
          if (response.error) {
            console.error("Join room error:", response.error);
          } else {
            console.log(`Joined room ${conversationId}`);
          }
        }
      );
    }
  }, []);

  const sendTyping = useCallback((conversationId: string) => {
    if (socketRef.current) {
      socketRef.current.emit("typing", { conversationId });
    }
  }, []);

  const sendMessage = useCallback(
    (
      conversationId: string,
      content: string,
      callback?: (response: SocketResponse) => void
    ) => {
      if (socketRef.current) {
        socketRef.current.emit(
          "send-message",
          { conversationId, content },
          callback
        );
      }
    },
    []
  );

  const onNewMessage = useCallback((callback: (message: any) => void) => {
    if (!socketRef.current) return () => undefined;
    socketRef.current.on("new-message", callback);
    return () => {
      socketRef.current?.off("new-message", callback);
    };
  }, []);

  const disconnect = useCallback(() => {
    socketRef.current?.disconnect();
  }, []);

  return {
    socket: socketRef.current,
    joinRoom,
    sendMessage,
    sendTyping,
    onNewMessage,
    disconnect,
  };
};
