import MainLayout from "@/layouts/MainLayout";
import { ToastContainer } from "react-toastify";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <MainLayout>
      {children}
      <ToastContainer position="top-right" />
    </MainLayout>
  );
}
