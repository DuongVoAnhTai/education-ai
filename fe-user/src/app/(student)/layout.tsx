import { PresenceProvider } from "@/context/PresenceContext";
import { SocketProvider } from "@/context/SocketContext";
import MainLayout from "@/layouts/MainLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SocketProvider>
      <PresenceProvider>
        <MainLayout>{children}</MainLayout>
      </PresenceProvider>
    </SocketProvider>
  );
}
