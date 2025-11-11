"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, AlertCircle } from "lucide-react";
import * as resourceIcon from "@/assets/Icon";
import * as skillService from "@/services/skillServices";

function SkillItem() {
  const params = useParams();
  const router = useRouter();
  const skillId = params.id as string;

  // --- STATE MANAGEMENT ---
  const [skill, setSkill] = useState<Skill | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          {skill.resources && skill.resources.length > 0 ? (
            skill.resources.map((resource) => (
              <Link
                href={resource.url || "#"}
                key={resource.id}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4 hover:border-blue-500 hover:shadow-md transition-all">
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
                </div>
              </Link>
            ))
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
            <p className="text-gray-600 whitespace-pre-wrap">
              {skill.description || "Chưa có mô tả cho kỹ năng này."}
            </p>
            {/* Có thể thêm các thông tin khác ở đây, ví dụ: số bài tập, nút bắt đầu... */}
          </div>
        </aside>
      </div>
    </div>
  );
}


export default SkillItem