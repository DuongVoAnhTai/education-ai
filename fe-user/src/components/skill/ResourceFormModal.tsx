"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";

interface ResourceFormModalProps {
  initialData?: LearningResource | null;
  onClose: () => void;
  onSave: (data: ResourceFormData) => Promise<void>;
  isSaving: boolean;
}

export default function ResourceFormModal({
  initialData,
  onClose,
  onSave,
  isSaving,
}: ResourceFormModalProps) {
  const [formData, setFormData] = useState<ResourceFormData>({
    title: "",
    resourceType: "LINK",
    url: "",
    content: "",
    ordering: 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        resourceType: initialData.resourceType || "LINK",
        url: initialData.url || "",
        content: initialData.content || "",
        ordering: initialData.ordering || 0,
      });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "ordering" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving || !formData.title?.trim()) return;
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {initialData ? "Chỉnh sửa Tài nguyên" : "Tạo Tài nguyên mới"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 max-h-[70vh] overflow-y-auto pr-2"
        >
          <label className="block">
            <span>Tiêu đề</span>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="mt-1 w-full border rounded-md p-2"
            />
          </label>
          <label className="block">
            <span>Loại tài nguyên</span>
            <select
              name="resourceType"
              value={formData.resourceType}
              onChange={handleChange}
              className="mt-1 w-full border rounded-md p-2 bg-white"
            >
              <option value="LINK">Link</option>
              <option value="ARTICLE">Bài viết</option>
              <option value="VIDEO">Video</option>
              <option value="FILE">Tệp</option>
              <option value="NOTE">Ghi chú</option>
            </select>
          </label>
          {formData.resourceType === "LINK" && (
            <label className="block">
              <span>URL</span>
              <input
                name="url"
                type="url"
                value={formData.url}
                onChange={handleChange}
                className="mt-1 w-full border rounded-md p-2"
              />
            </label>
          )}
          {(formData.resourceType === "ARTICLE" ||
            formData.resourceType === "NOTE") && (
            <label className="block">
              <span>Nội dung (hỗ trợ Markdown)</span>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={8}
                className="mt-1 w-full border rounded-md p-2"
              />
            </label>
          )}
          <label className="block">
            <span>Thứ tự</span>
            <input
              name="ordering"
              type="number"
              value={formData.ordering}
              onChange={handleChange}
              className="mt-1 w-full border rounded-md p-2"
            />
          </label>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-50 cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center disabled:bg-blue-400 cursor-pointer"
            >
              {isSaving && <Loader2 className="animate-spin mr-2" size={16} />}
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
