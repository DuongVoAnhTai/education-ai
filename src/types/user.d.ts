interface User {
  id: string;
  email: string;
  fullName: string | null;
  username?: string;
  role: string;
  avatarUrl: string | null;
}

interface ValidationErrorSignup {
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  confirmPassword?: string;
}

interface ValidationErrorLogin {
  emailOrUsername?: string;
  password?: string;
}

interface SearchUsersResponse {
  success: boolean;
  users?: User[];
  error?: string;
}