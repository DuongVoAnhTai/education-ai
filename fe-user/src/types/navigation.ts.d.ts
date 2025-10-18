type TabId = "dashboard" | "skills" | "chat" | "results" | "profile";

interface NavItem {
  id: TabId;
  label: string;
  icon: React.ElementType;
  path: string;
}
