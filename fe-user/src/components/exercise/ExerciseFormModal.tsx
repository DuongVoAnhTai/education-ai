"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

type ExerciseFormData = Omit<
  Exercise,
  "id" | "skillId" | "createdAt" | "updatedAt" | "_count"
>;

interface ExerciseFormModalProps {
  initialData?: Exercise | null;
  onClose: () => void;
  onSave: (data: ExerciseFormData) => Promise<void>;
  isSaving: boolean;
}

export default function ExerciseFormModal({
  initialData,
  onClose,
  onSave,
  isSaving,
}: ExerciseFormModalProps) {
  const [formData, setFormData] = useState<ExerciseFormData>({
    title: "",
    description: "",
    ordering: 0,
    timeLimitSeconds: 600, // 10 phút mặc định
    passScore: 70, // 70% mặc định
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        ordering: initialData.ordering || 0,
        timeLimitSeconds: initialData.timeLimitSeconds || 600,
        passScore: initialData.passScore || 70,
      });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "title" || name === "description"
          ? value
          : parseInt(value) || 0,
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
        <h2 className="text-xl font-bold mb-4">
          {initialData ? "Chỉnh sửa Bài tập" : "Tạo Bài tập mới"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <span>Mô tả</span>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="mt-1 w-full border rounded-md p-2"
            />
          </label>
          <div className="grid grid-cols-3 gap-4">
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
            <label className="block">
              <span>Thời gian (giây)</span>
              <input
                name="timeLimitSeconds"
                type="number"
                value={formData.timeLimitSeconds}
                onChange={handleChange}
                className="mt-1 w-full border rounded-md p-2"
              />
            </label>
            <label className="block">
              <span>Điểm pass (%)</span>
              <input
                name="passScore"
                type="number"
                value={formData.passScore}
                onChange={handleChange}
                className="mt-1 w-full border rounded-md p-2"
              />
            </label>
          </div>
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
