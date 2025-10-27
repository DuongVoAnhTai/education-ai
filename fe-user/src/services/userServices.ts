import * as httpRequest from "@/utils/httpRequest";

export const getUser = async (): Promise<User | undefined> => {
  try {
    const res = await httpRequest.get("users/me");

    return res.user;
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

export const updateUser = async (updateData: {
  avatarUrl?: string;
  fullName?: string;
  bio?: string;
}): Promise<User | undefined> => {
  try {
    const res = await httpRequest.put("users/me", updateData);

    return res.user;
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

export const searchUsers = async (
  q: any
): Promise<SearchUsersResponse | undefined> => {
  try {
    const res = await httpRequest.get("users/search", {
      params: {
        q,
      },
    });

    return res;
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}) => {
  try {
    const res = await httpRequest.put("users/change-password", data);
    return res;
  } catch (error: any) {
    if (error.response?.data?.errors) {
      return { errors: error.response.data.errors };
    }
    return { error: "Change password failed" };
  }
};