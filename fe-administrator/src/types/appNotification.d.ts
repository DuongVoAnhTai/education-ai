interface AppNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  type?: "info" | "success" | "warning" | "error";
}