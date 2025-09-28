import * as httpRequest from "@/utils/httpRequest";

export const login = async (emailOrUsername: string, password: string) => {
  try {
    const res = await httpRequest.post("users/login", { emailOrUsername, password });

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
    const res = await httpRequest.post("users/signup", {
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
