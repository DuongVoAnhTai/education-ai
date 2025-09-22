import { useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";

export const useSocket = (token: string) => {
  const socketRef = useRef<typeof Socket | null>(null);

  useEffect(() => {
    if (!token) return;

    socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
      auth: { token }, // Gửi token để auth
    });

    socketRef.current.on('connect', () => console.log('Socket connected'));
    socketRef.current.on('connect_error', (err: Error) => console.error('Connection error:', err));

    return () => {
      socketRef.current?.disconnect();
    };
  }, [token]);

  const joinRoom = (conversationId: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    socketRef.current?.emit('join-room', { conversationId }, (response: any) => {
      if (response.error) console.error(response.error);
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sendMessage = (conversationId: string, content: string, callback?: (response: any) => void) => {
    socketRef.current?.emit('send-message', { conversationId, content }, callback);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onNewMessage = (callback: (message: any) => void) => {
    socketRef.current?.on('new-message', callback);
  };

  return { joinRoom, sendMessage, onNewMessage };
};