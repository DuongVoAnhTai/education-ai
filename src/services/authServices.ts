import * as httpRequest from "@/utils/httpRequest";

export const login = async (email: string, password: string) => {
  try {
    const res = await httpRequest.post("users/login", { email, password });

    return res;
  } catch (error: any) {
    if (error.response?.data?.error) {
      return { error: error.response.data.error };
    }
    return { error: "Login failed" };
  }
};
