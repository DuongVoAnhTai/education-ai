// src/services/resourceServices.ts
import * as httpRequest from "@/utils/httpRequest";

type ResourceData = Omit<
  LearningResource,
  "id" | "skillId" | "createdAt" | "updatedAt"
>;

export const createResource = async (
  skillId: string,
  data: ResourceData
): Promise<ResourceServiceResponse> => {
  try {
    const res = await httpRequest.post(`skills/${skillId}/resources`, data);
    return res;
  } catch (error: any) {
    return {
      error: error.response?.data?.error || "Failed to create resource",
    };
  }
};

export const updateResource = async (
  resourceId: string,
  data: Partial<ResourceData>
): Promise<ResourceServiceResponse> => {
  try {
    const res = await httpRequest.put(`resources/${resourceId}`, data);
    return res;
  } catch (error: any) {
    return {
      error: error.response?.data?.error || "Failed to update resource",
    };
  }
};

export const deleteResource = async (
  resourceId: string
): Promise<ResourceServiceResponse> => {
  try {
    const res = await httpRequest.del(`resources/${resourceId}`);
    return res;
  } catch (error: any) {
    return {
      error: error.response?.data?.error || "Failed to delete resource",
    };
  }
};
