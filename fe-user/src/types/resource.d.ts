type ResourceFormData = Omit<
  LearningResource,
  "id" | "skillId" | "createdAt" | "updatedAt"
>;

interface ResourceServiceResponse {
  resource?: LearningResource;
  message?: string; // For delete operations
  error?: string;
}
