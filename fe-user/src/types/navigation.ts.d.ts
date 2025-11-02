type TabId = "dashboard" | "skills" | "quiz" | "chat" | "results" | "profile";

interface NavItem {
  id: TabId;
  label: string;
  icon: React.ElementType;
  path: string;
}
