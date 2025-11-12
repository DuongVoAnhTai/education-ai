"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import ExerciseResultDetail from "./ExerciseResultDetail";
import * as exerciseService from "@/services/exerciseServices";
import * as Icon from "@/assets/Image/exerciseIcon";

interface ExerciseResultProps {
  skillId: string;
  exerciseId: string;
}

export default function ExerciseResult({
  skillId,
  exerciseId,
}: ExerciseResultProps) {
  const router = useRouter();

  const [result, setResult] = useState<ExerciseResultData | null>(null);
  const [exercise, setExercise] = useState<
    (Exercise & { questions: Question[] }) | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const fetchResultData = async () => {
      setLoading(true);
      setError(null);

      // Fetch song song kết quả và chi tiết bài tập
      const [resultResponse, exerciseResponse] = await Promise.all([
        exerciseService.getExerciseResult(skillId, exerciseId),
        exerciseService.getExerciseById(skillId, exerciseId),
      ]);

      if ("error" in resultResponse) {
        setError(resultResponse.error);
        toast.error(resultResponse.error);
        setLoading(false);
        return;
      }

      if ("error" in exerciseResponse) {
        setError(exerciseResponse.error);
        toast.error(exerciseResponse.error);
        setLoading(false);
        return;
      }

      console.log("LOG", resultResponse);

      setResult(resultResponse);
      setExercise(exerciseResponse.exercise);
      setLoading(false);
    };
    fetchResultData();
  }, [skillId, exerciseId]);

  const handleRetry = () => {
    router.push(`/skills/${skillId}/exercises/${exerciseId}`);
  };

  const handleBackToList = () => {
    router.push(`/skills/${skillId}/exercises`);
  };

  const getGrade = (percentage: number) => {
    if (percentage >= 90)
      return { label: "Xuất sắc", color: "text-green-600", bg: "bg-green-100" };
    if (percentage >= 80)
      return { label: "Giỏi", color: "text-blue-600", bg: "bg-blue-100" };
    if (percentage >= 70)
      return { label: "Khá", color: "text-yellow-600", bg: "bg-yellow-100" };
    if (percentage >= 60)
      return {
        label: "Trung bình",
        color: "text-orange-600",
        bg: "bg-orange-100",
      };
    return { label: "Cần cải thiện", color: "text-red-600", bg: "bg-red-100" };
  };

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

  if (!result || !exercise) return null;

  const percentage =
    result.totalPoints > 0
      ? Math.round((result.score / result.totalPoints) * 100)
      : 0;
  const passed = exercise.passScore != null && percentage >= exercise.passScore;
  const grade = getGrade(percentage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mb-4">
              <Icon.Trophy size={40} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {exercise.title}
            </h1>
            <p className="text-gray-600">Kết quả bài tập của bạn</p>
          </div>

          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <svg className="w-48 h-48 transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  className="text-gray-200"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 88}`}
                  strokeDashoffset={`${
                    2 * Math.PI * 88 * (1 - percentage / 100)
                  }`}
                  className={passed ? "text-green-500" : "text-red-500"}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                  className={`text-5xl font-bold ${
                    passed ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {percentage}%
                </span>
                <span
                  className={`text-sm font-medium mt-1 px-3 py-1 rounded-full ${grade.bg} ${grade.color}`}
                >
                  {grade.label}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <Icon.CheckCircle size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-700">
                    {result.correctCount}
                  </p>
                  <p className="text-xs text-green-600">Đúng</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                  <Icon.XCircle size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-700">
                    {result.wrongCount}
                  </p>
                  <p className="text-xs text-red-600">Sai</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Icon.Target size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-700">
                    {result.score}/{result.totalPoints}
                  </p>
                  <p className="text-xs text-blue-600">Điểm</p>
                </div>
              </div>
            </div>

            {/* <div className="bg-gradient-to-b  r from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Icon.Clock size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-lg font-bold text-purple-700">
                    {Math.floor(result.timeSpent / 60)}:
                    {(result.timeSpent % 60).toString().padStart(2, "0")}
                  </p>
                  <p className="text-xs text-purple-600">Thời gian</p>
                </div>
              </div>
            </div> */}
          </div>

          <div
            className={`rounded-xl p-4 mb-6 ${
              passed
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            <div className="flex items-center space-x-3">
              {passed ? (
                <>
                  <Icon.CheckCircle size={24} className="text-green-600" />
                  <div>
                    <p className="font-semibold text-green-900">
                      Chúc mừng! Bạn đã hoàn thành bài tập!
                    </p>
                    <p className="text-sm text-green-700">
                      Bạn có thể tiếp tục với bài tập tiếp theo.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <Icon.XCircle size={24} className="text-red-600" />
                  <div>
                    <p className="font-semibold text-red-900">
                      Chưa đạt! Hãy cố gắng lần sau.
                    </p>
                    <p className="text-sm text-red-700">
                      Bạn cần đạt ít nhất {exercise.passScore}% để vượt qua.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleRetry}
              className="flex-1 min-w-[200px] flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-lg transition-all transform hover:scale-105 cursor-pointer"
            >
              <Icon.RefreshCw size={20} />
              <span>Làm lại</span>
            </button>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex-1 min-w-[200px] flex items-center justify-center space-x-2 px-6 py-3 bg-white border-2 border-purple-500 text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition-all cursor-pointer"
            >
              <Icon.Lightbulb size={20} />
              <span>{showDetails ? "Ẩn chi tiết" : "Xem chi tiết"}</span>
            </button>
            <button
              onClick={handleBackToList}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all cursor-pointer"
            >
              <Icon.Home size={20} />
              <span>Về danh sách</span>
            </button>
          </div>
        </div>

        {showDetails && (
          <ExerciseResultDetail exercise={exercise} result={result} />
        )}
      </div>
    </div>
  );
}
