"use client";

import { useState, useEffect } from "react";
import AsyncCreatableSelect from "react-select/async-creatable";
import { X, Loader2 } from "lucide-react";
import * as tagService from "@/services/tagServices";

interface SkillFormModalProps {
  initialData?: Skill | null;
  onClose: () => void;
  onSave: (data: any, tags: TagOption[]) => Promise<void>;
  isSaving: boolean;
}

export default function SkillFormModal({
  initialData,
  onClose,
  onSave,
  isSaving,
}: SkillFormModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<
    "PUBLIC" | "PRIVATE" | "UNLISTED"
  >("PRIVATE");

  const [selectedTags, setSelectedTags] = useState<TagOption[]>([]);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || "");
      setVisibility(initialData.visibility);
      setSelectedTags(
        initialData.tags
          ? initialData.tags.map((tag) => ({ value: tag.id, label: tag.name }))
          : []
      );
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving || !title.trim()) return;

    const data = {
      title,
      description,
      visibility,
    };
    onSave(data, selectedTags);
  };

  const loadTagOptions = async (inputValue: string) => {
    if (inputValue.length < 1) {
      return [];
    }

    const results = await tagService.searchTags(inputValue);
    const options = results.map((tag) => ({ value: tag.id, label: tag.name }));
    return options;
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {initialData ? "Chỉnh sửa Kỹ năng" : "Tạo Kỹ năng mới"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium">Tiêu đề</span>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-1 w-full border rounded-md p-2"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Mô tả</span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="mt-1 w-full border rounded-md p-2"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Hiển thị</span>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as any)}
                className="mt-1 w-full border rounded-md p-2 bg-white"
              >
                <option value="PUBLIC">Công khai</option>
                <option value="PRIVATE">Riêng tư</option>
                <option value="UNLISTED">Không liệt kê</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium">Tags</span>
              <AsyncCreatableSelect
                isMulti // Cho phép chọn nhiều
                placeholder="Chọn hoặc tạo tag..."
                value={selectedTags}
                onChange={(newValue) =>
                  setSelectedTags(newValue as TagOption[])
                }
                loadOptions={loadTagOptions} // Hàm để tìm kiếm tag
                defaultOptions // Tải options ngay khi focus
                cacheOptions // Cache kết quả tìm kiếm
                formatCreateLabel={(inputValue) =>
                  `Tạo tag mới: "${inputValue}"`
                } // Tùy chỉnh text khi tạo tag mới
                className="mt-1"
                classNamePrefix="react-select" // Để dễ dàng style
              />
            </label>
          </div>
          <div className="flex justify-end gap-3 mt-6">
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
              {initialData ? "Lưu thay đổi" : "Tạo mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
