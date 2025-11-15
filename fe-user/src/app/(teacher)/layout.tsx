import { PresenceProvider } from "@/context/PresenceContext";
import { SocketProvider } from "@/context/SocketContext";
import TeacherLayout from "@/layouts/TeacherLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SocketProvider>
      <PresenceProvider>
        <TeacherLayout>{children}</TeacherLayout>
      </PresenceProvider>
    </SocketProvider>
  );
}
