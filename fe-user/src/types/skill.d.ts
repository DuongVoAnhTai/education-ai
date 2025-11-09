// Kiểu dữ liệu cơ bản cho một Tag
interface Tag {
  id: string;
  name: string;
}

// Kiểu dữ liệu cho Learning Resource
interface LearningResource {
  id: string;
  skillId: string;
  title: string;
  resourceType: "LINK" | "ARTICLE" | "VIDEO" | "FILE" | "NOTE";
  url?: string;
  content?: string;
  ordering?: number;
}

// Kiểu dữ liệu cho Exercise (cơ bản)
interface Exercise {
  id: string;
  skillId: string;
  title: string;
  description?: string;
  ordering?: number;
}

// Kiểu dữ liệu cho User (chỉ những thông tin cần thiết)
interface SkillOwner {
  id: string;
  fullName: string;
  avatarUrl?: string;
}

// Kiểu dữ liệu đầy đủ cho một Skill (khi fetch danh sách hoặc chi tiết)
interface Skill {
  id: string;
  ownerId: string;
  title: string;
  description?: string;
  visibility: "PUBLIC" | "PRIVATE" | "UNLISTED";
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string

  // Dữ liệu từ các quan hệ (relations)
  tags: Tag[];
  owner: SkillOwner;
  resources?: LearningResource[]; // Có thể không có khi fetch danh sách
  exercises?: Exercise[]; // Có thể không có khi fetch danh sách
}

// Dữ liệu cần thiết để tạo một Skill mới
interface CreateSkillData {
  ownerId: string;
  title: string;
  description?: string;
  visibility?: "PUBLIC" | "PRIVATE" | "UNLISTED";
}

// Dữ liệu để cập nhật một Skill
interface UpdateSkillData {
  title?: string;
  description?: string;
  visibility?: "PUBLIC" | "PRIVATE" | "UNLISTED";
}
