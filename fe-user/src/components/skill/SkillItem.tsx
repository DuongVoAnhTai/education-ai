"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  AlertCircle,
  BookOpen,
  PlusCircle,
  Edit,
  Trash2,
} from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import * as resourceIcon from "@/assets/Icon/resourceIcon";
import * as skillService from "@/services/skillServices";
import * as resourceService from "@/services/resourceServices";
import ResourceFormModal from "./ResourceFormModal";

function SkillItem() {
  const params = useParams();
  const router = useRouter();
  const skillId = params.id as string;

  // --- STATE MANAGEMENT ---
  const [skill, setSkill] = useState<Skill | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { userDetail } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResource, setEditingResource] =
    useState<LearningResource | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const canManage =
    userDetail?.role === "ADMIN" || userDetail?.role === "TEACHER";

  useEffect(() => {
    if (!skillId) {
      router.push("/skills"); // Nếu không có ID, quay về trang danh sách
      return;
    }

    const fetchSkillDetail = async () => {
      setLoading(true);
      setError(null);
      const result = await skillService.getSkillById(skillId);

      if (result) {
        setSkill(result);
      } else {
        setError("Không tìm thấy kỹ năng hoặc bạn không có quyền truy cập.");
      }
      setLoading(false);
    };

    fetchSkillDetail();
  }, [skillId, router]);

  const handleOpenCreateModal = () => {
    setEditingResource(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (resource: LearningResource) => {
    setEditingResource(resource);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingResource(null);
  };

  const handleSaveResource = async (data: any) => {
    if (!skill) return;
    setIsSaving(true);
    let response: ResourceServiceResponse;

    if (editingResource) {
      // Chế độ sửa
      response = await resourceService.updateResource(editingResource.id, data);
      if (response.resource) {
        setSkill((prev) =>
          prev
            ? {
                ...prev,
                resources: prev.resources?.map((r) =>
                  r.id === editingResource.id && response.resource
                    ? response.resource
                    : r
                ) as LearningResource[],
              }
            : null
        );
        toast.success("Cập nhật tài nguyên thành công!");
      }
    } else {
      // Chế độ tạo mới
      response = await resourceService.createResource(skill.id, data);
      if (response.resource) {
        setSkill((prev) =>
          prev
            ? {
                ...prev,
                resources: [
                  ...(prev.resources || []),
                  response.resource as LearningResource,
                ],
              }
            : null
        );
        toast.success("Tạo tài nguyên thành công!");
      }
    }

    if (response.error) {
      toast.error(response.error);
    } else {
      handleCloseModal();
    }
    setIsSaving(false);
  };

  const handleDeleteResource = async (resourceId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa tài nguyên này?")) return;

    const response = await resourceService.deleteResource(resourceId);
    if (response.message) {
      setSkill((prev) =>
        prev
          ? {
              ...prev,
              resources: prev.resources?.filter((r) => r.id !== resourceId),
            }
          : null
      );
      toast.success("Xóa tài nguyên thành công!");
    } else {
      toast.error(response.error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-red-50 border border-red-200 rounded-lg">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-xl font-semibold text-red-700">Đã xảy ra lỗi</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!skill) return null;

  const linkHref = canManage
    ? `/teacher/skills/${skill.id}/exercises` // Đường dẫn đến trang SỬA của Teacher
    : `/skills/${skill.id}/exercises`;

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header: Title và Tags */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          {skill.title}
        </h1>
      </header>

      {/* Main Content: Layout 2 cột */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột chính: Danh sách tài liệu */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">
            Lộ trình học tập
          </h2>
          {canManage && (
            <div className="flex items-center justify-end">
              <button
                onClick={handleOpenCreateModal}
                className="flex items-center gap-2 text-sm px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                <PlusCircle size={16} />
                Thêm
              </button>
            </div>
          )}
          {skill.resources && skill.resources.length > 0 ? (
            <div className="space-y-3">
              {skill.resources.map((resource) => (
                <div
                  key={resource.id}
                  className="bg-white p-4 my-4 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4 hover:border-blue-500 hover:shadow-md transition-all"
                >
                  <Link
                    href={resource.url || "#"}
                    key={resource.id}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center gap-4"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <resourceIcon.GetResourceIcon
                        type={resource.resourceType}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">
                        {resource.title}
                      </p>
                      <span className="text-xs text-gray-500 uppercase">
                        {resource.resourceType}
                      </span>
                    </div>
                  </Link>

                  {canManage && (
                    <div className="flex items-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Ngăn sự kiện click lan ra ngoài
                          handleOpenEditModal(resource);
                        }}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-md cursor-pointer"
                        title="Sửa"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteResource(resource.id);
                        }}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md"
                        title="Xóa"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-dashed">
              <p className="text-gray-500">
                Chưa có tài liệu nào cho kỹ năng này.
              </p>
            </div>
          )}
        </div>

        {/* Cột phụ: Mô tả và các thông tin khác */}
        <aside className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm sticky top-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Giới thiệu
            </h3>
            <p className="text-gray-600 whitespace-pre-wrap mb-5">
              {skill.description || "Chưa có mô tả cho kỹ năng này."}
            </p>

            <hr />

            {/* Phần bài tập */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-5">
                Bài tập
              </h3>
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <BookOpen className="w-5 h-5 mr-2 text-blue-500" />
                <span>{skill.exercises?.length || 0} bài tập có sẵn</span>
              </div>

              {/* Nút điều hướng đến trang danh sách bài tập của skill này */}
              <Link href={linkHref}>
                <button className="w-full py-2 px-4 rounded-lg font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg transition-all duration-200 cursor-pointer">
                  Xem danh sách bài tập
                </button>
              </Link>
            </div>
          </div>
        </aside>

        {isModalOpen && (
          <ResourceFormModal
            initialData={editingResource}
            onClose={handleCloseModal}
            onSave={handleSaveResource}
            isSaving={isSaving}
          />
        )}
      </div>
    </div>
  );
}

export default SkillItem;
