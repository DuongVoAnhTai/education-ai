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

interface ValidationErrorChangePassword {
  currentPassword?: string;
  newPassword?: string
  confirmNewPassword?: string
}