import * as httpRequest from "@/utils/httpRequest";

export const searchTags = async (query: string): Promise<Tag[]> => {
  if (!query) return [];
  try {
    const res = await httpRequest.get("tags", { params: { q: query } });
    return res.tags || [];
  } catch (error) {
    return [];
  }
};
