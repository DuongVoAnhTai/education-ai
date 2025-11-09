import * as httpRequest from "@/utils/httpRequest";

export const getSkills = async (
  params: {
    take?: number;
    cursor?: string;
    q?: string; // Search query
    tag?: string; // Tag name to filter by
  } = {}
): Promise<{ skills: Skill[]; nextCursor: string | null }> => {
  try {
    const res = await httpRequest.get("skills", { params });
    return res;
  } catch (error: any) {
    console.error("Failed to fetch skills:", error);
    // Trả về một giá trị mặc định để tránh crash app
    return { skills: [], nextCursor: null };
  }
};

export const getSkillById = async (skillId: string): Promise<Skill | null> => {
  if (!skillId) return null;
  try {
    const res = await httpRequest.get(`skills/${skillId}`);
    return res;
  } catch (error: any) {
    console.error(`Failed to fetch skill ${skillId}:`, error);
    return null;
  }
};

export const createSkill = async (
  data: CreateSkillData
): Promise<{ skill: Skill } | { error: string }> => {
  try {
    const res = await httpRequest.post("skills", data);
    return res;
  } catch (error: any) {
    return { error: error.response?.data?.error || "Failed to create skill" };
  }
};

export const updateSkill = async (
  skillId: string,
  data: UpdateSkillData
): Promise<{ skill: Skill } | { error: string }> => {
  try {
    const res = await httpRequest.put(`skills/${skillId}`, data);
    return res;
  } catch (error: any) {
    return { error: error.response?.data?.error || "Failed to update skill" };
  }
};

export const deleteSkill = async (
  skillId: string
): Promise<{ message: string } | { error: string }> => {
  try {
    const res = await httpRequest.del(`skills/${skillId}`);
    return res;
  } catch (error: any) {
    return { error: error.response?.data?.error || "Failed to delete skill" };
  }
};

export const addTagToSkill = async (
  skillId: string,
  tagName: string
): Promise<{ tag: Tag } | { error: string }> => {
  try {
    const res = await httpRequest.post(`skills/${skillId}/tags`, { tagName });
    return res;
  } catch (error: any) {
    return { error: error.response?.data?.error || "Failed to add tag" };
  }
};

export const removeTagFromSkill = async (
  skillId: string,
  tagId: string
): Promise<{ message: string } | { error: string }> => {
  try {
    const res = await httpRequest.del(`skills/${skillId}/tags/${tagId}`);
    return res;
  } catch (error: any) {
    return { error: error.response?.data?.error || "Failed to remove tag" };
  }
};
