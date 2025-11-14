import * as httpRequest from "@/utils/httpRequest";

export const login = async (emailOrUsername: string, password: string) => {
  try {
    const res = await httpRequest.post("auth/login", { emailOrUsername, password });

    return res;
  } catch (error: any) {
    if (error.response?.data?.errors) {
      return { errors: error.response.data.errors };
    }
    return { error: "Login failed" };
  }
};

export const signup = async (
  email: string,
  username: string,
  firstName: string,
  lastName: string,
  password: string,
  confirmPassword: string
) => {
  try {
    const res = await httpRequest.post("auth/signup", {
      email,
      username,
      firstName,
      lastName,
      password,
      confirmPassword,
    });

    return res; // { message: "...", user: ... }
  } catch (error: any) {
    if (error.response?.data?.errors) {
      return { errors: error.response.data.errors };
    }
    return { error: "Sign up failed" };
  }
};

export const logout = async () => {
  try {
    await httpRequest.post("auth/logout");
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    return { ok: true };
  } catch (error) {
    console.error("Logout failed:", error);
    return { ok: false, error };
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const res = await httpRequest.post("auth/forgot-password", { email });
    return res;
  } catch (error: any) {
    return { errors: error.response?.data?.errors || "Failed to send reset email" };
  }
};

export const resetPassword = async (
  token: string,
  password: string,
  confirmPassword: string
) => {
  try {
    const res = await httpRequest.post("auth/reset-password", {
      token,
      password,
      confirmPassword,
    });
    return res;
  } catch (error: any) {
    if (error.response?.data?.errors) {
      return { errors: error.response.data.errors };
    }
    return { error: "Password reset failed" };
  }
};
