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
