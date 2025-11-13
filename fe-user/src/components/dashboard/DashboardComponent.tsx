"use client"

import { useEffect, useState } from "react";
import { BookOpen, CheckCircle, FileText, Loader2, Star } from "lucide-react";
import Link from "next/link";
import SummaryCard from "./SummaryCard";
import * as dashboardService from "@/services/dashboardServices";

function DashboardComponent() {
  const [summary, setSummary] = useState<any>(null);
  const [learningProgress, setLearningProgress] = useState<any[]>([]);
  const [recentResults, setRecentResults] = useState<
    ExerciseResultHistoryItem[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);

      // Chỉ cần gọi 1 API duy nhất
      const response = await dashboardService.getDashboardSummary();

      if (response.error) {
        setError(response.error);
      } else {
        setSummary(response.summary);
        setLearningProgress(response.learningProgress);
        setRecentResults(response.recentResults);
      }
      setLoading(false);
    };
    fetchDashboardData();
  }, []);

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
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          title="Kỹ năng đang học"
          value={summary?.skillsInProgressCount?.toString() || "0"}
          icon={<BookOpen size={32} className="text-blue-200" />}
          gradient="from-blue-500 to-blue-600"
        />
        <SummaryCard
          title="Bài hoàn thành"
          value={summary?.totalCompletedCount?.toString() || "0"}
          icon={<CheckCircle size={32} className="text-green-200" />}
          gradient="from-green-500 to-green-600"
        />
        <SummaryCard
          title="Tổng bài tập"
          value={summary?.totalExercises?.toString() || "0"}
          icon={<FileText size={32} className="text-purple-200" />}
          gradient="from-purple-500 to-purple-600"
        />
        <SummaryCard
          title="Điểm TB"
          value={summary?.averageScore?.toFixed(1) || "0.0"}
          icon={<Star size={32} className="text-orange-200" />}
          gradient="from-orange-500 to-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Tiến độ học tập
          </h3>
          <div className="space-y-4">
            {learningProgress.map((skill) => (
              <Link href={`/skills/${skill.id}`} key={skill.id}>
                <div
                  key={skill.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{skill.title}</h4>
                    <p className="text-xs text-gray-500">{skill.description}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${skill.progress || 0}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">
                        {skill.progress || 0}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {skill.completedExercises}/{skill.exerciseCount} bài tập
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Results */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Kết quả gần đây
          </h3>
          <div className="space-y-4">
            {recentResults.map((r) => (
              <div
                key={r.exerciseId}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <h4 className="font-medium text-gray-900">
                    {r.exerciseTitle}
                  </h4>
                  <p className="text-sm text-gray-600">{r.skillTitle}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(r.submittedAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600">
                    {r.score}/{r.totalPoints}
                  </p>
                  <p className="text-xs text-gray-500">
                    {((r.score / r.totalPoints) * 100).toFixed(0)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardComponent;
