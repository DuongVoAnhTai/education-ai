"use client";

import { useMemo, useState } from "react";

function SkillComponent() {
  const [skills, setSkills] = useState<Skill[]>([]);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredSkills = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return skills;
    return skills.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q) ||
        s.tags?.some((tag) => tag.toLowerCase().includes(q))
    );
  }, [skills, searchQuery]);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Kỹ năng của tôi</h2>
        <button
          onClick={() => alert("Tính năng thêm kỹ năng - Cần tích hợp API")}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200"
        >
          + Thêm kỹ năng mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSkills.map((skill) => (
          <div
            key={skill.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200"
          >
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

              {skill.tags && skill.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {skill.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                    >
                      <Hash size={10} className="mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Tiến độ</span>
                  <span>
                    {skill.completedExercises}/{skill.exerciseCount} bài
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${skill.progress || 0}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {skill.progress || 0}% hoàn thành
                </p>
              </div>

              <button
                onClick={() => setActiveTab("quiz")}
                className="w-full py-2 px-4 rounded-lg font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg transition-all duration-200"
              >
                Xem bài tập
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SkillComponent;
