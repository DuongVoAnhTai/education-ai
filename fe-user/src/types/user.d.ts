interface User {
  id: string;
  email: string;
  fullName: string | null;
  username?: string;
  role: string;
  avatarUrl: string | null;
  bio: string | null;
}
interface SearchUsersResponse {
  success: boolean;
  users?: User[];
  error?: string;
}
