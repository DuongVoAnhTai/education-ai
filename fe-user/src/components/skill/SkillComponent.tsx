"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Edit,
  Hash,
  Loader2,
  MoreVertical,
  PlusCircle,
  Trash2,
} from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import * as skillService from "@/services/skillServices";
import SkillFormModal from "./SkillFormModal";

function SkillComponent() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State cho các tính năng UI
  const [searchQuery, setSearchQuery] = useState("");

  // State cho infinite scroll (sẽ cần sau, chuẩn bị trước)
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const { userDetail } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null); // Skill đang được sửa
  const [isSaving, setIsSaving] = useState(false);

  const canManage =
    userDetail?.role === "ADMIN" || userDetail?.role === "TEACHER";
  const [openDropdown, setOpenDropdown] = useState(false);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastSkillElementRef = useCallback(
    (node: HTMLDivElement) => {
      // Logic tương tự như MessageSidebar
      if (loading || loadingMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && nextCursor) {
          loadMoreSkills();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, loadingMore, nextCursor]
  );

  const loadMoreSkills = async () => {
    if (loadingMore || !nextCursor) return;
    setLoadingMore(true);

    const result = await skillService.getSkills({
      take: 20,
      cursor: nextCursor, // Sử dụng cursor đã fetch
    });

    if (result.skills) {
      setSkills((prev) => [...prev, ...result.skills]);
      setNextCursor(result.nextCursor);
    }
    setLoadingMore(false);
  };

  useEffect(() => {
    const loadInitialSkills = async () => {
      setLoading(true);
      setError(null);
      const response = await skillService.getSkills({ take: 20 }); // Lấy 20 skill đầu tiên

      if (response.skills) {
        setSkills(response.skills);
        setNextCursor(response.nextCursor);
      } else {
        setError("Không thể tải danh sách kỹ năng.");
      }
      setLoading(false);
    };
    loadInitialSkills();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingSkill(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (skill: Skill) => {
    setEditingSkill(skill);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSkill(null);
  };

  const handleSaveSkill = async (data: any, selectedTags: TagOption[]) => {
    setIsSaving(true);
    let skillId: string | undefined = editingSkill?.id; // Lấy ID nếu đang sửa

    try {
      if (editingSkill) {
        // --- Chế độ SỬA ---
        const response = await skillService.updateSkill(editingSkill.id, data);
        if ("error" in response)
          throw new Error(response.error || "Cập nhật kỹ năng thất bại.");
      } else {
        // --- Chế độ TẠO MỚI ---
        const createData = { ...data, ownerId: userDetail?.id };
        const response = await skillService.createSkill(createData);
        if ("error" in response)
          throw new Error(response.error || "Tạo kỹ năng thất bại.");
        skillId = response.skill.id; // Lấy ID của skill vừa tạo
      }

      if (!skillId) {
        throw new Error("Không thể xác định ID của kỹ năng.");
      }

      // --- BƯỚC 2: XỬ LÝ TAGS ---
      // Lấy danh sách tag hiện tại của skill (trước khi thay đổi)
      const currentTags = editingSkill?.tags || [];
      const currentTagNames = new Set(currentTags.map((t) => t.name));
      const newTagNames = new Set(selectedTags.map((t) => t.label));

      // Xác định tags cần thêm và xóa
      const tagsToAdd = selectedTags.filter(
        (tag) => !currentTagNames.has(tag.label)
      );
      const tagsToRemove = currentTags.filter(
        (tag) => !newTagNames.has(tag.name)
      );

      // Thực hiện các API call để thêm/xóa tag song song
      const tagPromises = [
        ...tagsToAdd.map((tag) =>
          skillService.addTagToSkill(skillId!, tag.label)
        ),
        ...tagsToRemove.map((tag) =>
          skillService.removeTagFromSkill(skillId!, tag.id)
        ),
      ];

      // Chờ tất cả các thao tác tag hoàn thành
      const tagResults = await Promise.all(tagPromises);

      // Kiểm tra lỗi trong quá trình xử lý tag (tùy chọn)
      const tagError = tagResults.find((res) => "error" in res);
      if (tagError) {
        console.warn("Đã có lỗi xảy ra khi cập nhật tag:", tagError);
        // Có thể không cần throw error, chỉ log ra để người dùng biết
      }

      // --- BƯỚC 3: CẬP NHẬT UI ---
      // Fetch lại dữ liệu cuối cùng của skill để đảm bảo UI đồng bộ 100%
      const fetchedSkillData = await skillService.getSkillById(skillId);

      if (fetchedSkillData) {
        // Ensure tags are updated in the UI immediately
        const updatedSkillWithTags: Skill = {
          ...fetchedSkillData,
          tags: selectedTags.map((tagOption) => ({
            id: tagOption.value,
            name: tagOption.label,
          })),
        };

        if (editingSkill) {
          // Cập nhật skill trong danh sách
          setSkills((prev) =>
            prev.map((s) => (s.id === skillId ? updatedSkillWithTags : s))
          );
        } else {
          // Thêm skill mới vào đầu danh sách
          setSkills((prev) => [updatedSkillWithTags, ...prev]);
        }
      }

      toast.success("Lưu kỹ năng thành công!");
      handleCloseModal();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSkill = async (skillId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa kỹ năng này?")) return;

    const response = await skillService.deleteSkill(skillId);
    if ("message" in response) {
      // Xóa skill khỏi state
      setSkills((prev) => prev.filter((s) => s.id !== skillId));
      toast.success("Xóa kỹ năng thành công!");
    } else {
      toast.error(response.error || "Xóa thất bại.");
    }
  };

  const filteredSkills = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return skills;
    return skills.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q) ||
        s.tags.some((tag) => tag.name && tag.name.toLowerCase().includes(q))
    );
  }, [skills, searchQuery]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {canManage ? "Quản lý Kỹ năng" : "Kỹ năng của tôi"}
        </h2>

        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Tìm kiếm kỹ năng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg w-full md:w-auto"
          />

          {canManage && (
            <button
              onClick={handleOpenCreateModal}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 cursor-pointer"
            >
              <PlusCircle size={20} />
              Tạo mới
            </button>
          )}
        </div>
      </div>

      {filteredSkills.length === 0 ? (
        <div className="text-center text-gray-500 py-16">
          <p>Không tìm thấy kỹ năng nào phù hợp.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill, index) => {
            const isLastElement = index === skills.length - 1;
            const linkHref = canManage
              ? `/teacher/skills/${skill.id}` // Đường dẫn đến trang SỬA của Teacher
              : `/skills/${skill.id}`;

            return (
              <div
                ref={isLastElement ? lastSkillElementRef : null}
                key={skill.id}
                className="relative group"
              >
                {canManage && (
                  <div className="absolute top-4 right-4">
                    <div className="relative">
                      <button
                        onClick={() => {
                          setOpenDropdown(!openDropdown);
                        }}
                        className="p-1.5 bg-white/50 backdrop-blur-sm rounded-full hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <MoreVertical size={18} />
                      </button>
                      {openDropdown && (
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setOpenDropdown(false)}
                        />
                      )}

                      {/* Dropdown menu (ví dụ đơn giản) */}
                      {openDropdown && (
                        <div className="absolute right-0 mt-1 w-32 bg-white border rounded-md shadow-lg hidden group-focus-within:block z-20">
                          <button
                            onClick={() => handleOpenEditModal(skill)}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
                          >
                            <Edit size={14} /> Sửa
                          </button>
                          <button
                            onClick={() => handleDeleteSkill(skill.id)}
                            className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                          >
                            <Trash2 size={14} /> Xóa
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <Link href={linkHref} key={skill.id}>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex-1">
                          {skill.title}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            skill.visibility === "PUBLIC"
                              ? "bg-green-100 text-green-700"
                              : skill.visibility === "PRIVATE"
                              ? "bg-gray-100 text-gray-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {skill.visibility}
                        </span>
                      </div>

                      {skill.description && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {skill.description}
                        </p>
                      )}

                      <div className="flex-grow"></div>

                      {skill.tags && skill.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-4">
                          {skill.tags.map((tag, index) => (
                            <span
                              key={tag.id || index}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                            >
                              <Hash size={10} className="mr-1" />
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}

      {loadingMore && (
        <div className="flex justify-center items-center p-4">
          <Loader2 className="animate-spin text-gray-400" />
        </div>
      )}

      {isModalOpen && (
        <SkillFormModal
          initialData={editingSkill}
          onClose={handleCloseModal}
          onSave={handleSaveSkill}
          isSaving={isSaving}
        />
      )}
    </div>
  );
}

export default SkillComponent;
