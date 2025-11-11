"use client";

import { useState } from "react";

export default function ExerciseList() {
  const [viewMode, setViewMode] = useState<"list" | "taking" | "result">(
    "list"
  );
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Map<string, string>>(
    new Map()
  );
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [attempt, setAttempt] = useState<ExerciseAttempt | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedResultQuestion, setSelectedResultQuestion] = useState(0);

  // ==================== RESULT ====================
  const handleRetry = () => {
    if (!selectedExercise) return;
    setTimeRemaining(selectedExercise.timeLimitSeconds || 900);
    setCurrentQuestionIndex(0);
    setUserAnswers(new Map());
    setViewMode("taking");
  };

  const handleBackToList = () => {
    setViewMode("list");
    setSelectedExercise(null);
    setAttempt(null);
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

  if (viewMode === "result" && attempt && selectedExercise) {
    const grade = getGrade(attempt.percentage);
    const correctCount = Array.from(attempt.answers.values()).filter(
      (ans) => ans.score && ans.score > 0
    ).length;
    const incorrectCount = selectedExercise.questions.length - correctCount;

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mb-4">
                <Trophy size={40} className="text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {attempt.exerciseTitle}
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
                      2 * Math.PI * 88 * (1 - attempt.percentage / 100)
                    }`}
                    className={
                      attempt.passed ? "text-green-500" : "text-red-500"
                    }
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span
                    className={`text-5xl font-bold ${
                      attempt.passed ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {attempt.percentage}%
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
                    <CheckCircle size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-700">
                      {correctCount}
                    </p>
                    <p className="text-xs text-green-600">Đúng</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                    <XCircle size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-700">
                      {incorrectCount}
                    </p>
                    <p className="text-xs text-red-600">Sai</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Target size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-700">
                      {attempt.totalScore}/{attempt.maxScore}
                    </p>
                    <p className="text-xs text-blue-600">Điểm</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Clock size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-purple-700">
                      {Math.floor(attempt.timeSpent / 60)}:
                      {(attempt.timeSpent % 60).toString().padStart(2, "0")}
                    </p>
                    <p className="text-xs text-purple-600">Thời gian</p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`rounded-xl p-4 mb-6 ${
                attempt.passed
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <div className="flex items-center space-x-3">
                {attempt.passed ? (
                  <>
                    <CheckCircle size={24} className="text-green-600" />
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
                    <XCircle size={24} className="text-red-600" />
                    <div>
                      <p className="font-semibold text-red-900">
                        Chưa đạt! Hãy cố gắng lần sau.
                      </p>
                      <p className="text-sm text-red-700">
                        Bạn cần đạt ít nhất {selectedExercise.passScore}% để
                        vượt qua.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleRetry}
                className="flex-1 min-w-[200px] flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-lg transition-all transform hover:scale-105"
              >
                <RefreshCw size={20} />
                <span>Làm lại</span>
              </button>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex-1 min-w-[200px] flex items-center justify-center space-x-2 px-6 py-3 bg-white border-2 border-purple-500 text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition-all"
              >
                <Lightbulb size={20} />
                <span>{showDetails ? "Ẩn chi tiết" : "Xem chi tiết"}</span>
              </button>
              <button
                onClick={handleBackToList}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all"
              >
                <Home size={20} />
                <span>Về danh sách</span>
              </button>
            </div>
          </div>

          {showDetails && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Chi tiết từng câu hỏi
              </h3>

              <div className="flex overflow-x-auto gap-2 mb-6 pb-2">
                {selectedExercise.questions.map((q, index) => {
                  const userAnswer = attempt.answers.get(q.id);
                  const isCorrect =
                    userAnswer && userAnswer.score && userAnswer.score > 0;

                  return (
                    <button
                      key={q.id}
                      onClick={() => setSelectedResultQuestion(index)}
                      className={`min-w-[48px] h-12 rounded-lg font-semibold text-sm transition-all ${
                        selectedResultQuestion === index
                          ? "bg-blue-500 text-white ring-2 ring-blue-300 scale-110"
                          : isCorrect
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-red-100 text-red-700 hover:bg-red-200"
                      }`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>

              {selectedExercise.questions[selectedResultQuestion] && (
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      {selectedResultQuestion + 1}
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 flex-1">
                      {
                        selectedExercise.questions[selectedResultQuestion]
                          .prompt
                      }
                    </h4>
                  </div>

                  <div className="space-y-3 ml-11">
                    {selectedExercise.questions[
                      selectedResultQuestion
                    ].options.map((option) => {
                      const userAnswer = attempt.answers.get(
                        selectedExercise.questions[selectedResultQuestion].id
                      );
                      const isUserAnswer =
                        userAnswer?.selectedOptionId === option.id;
                      const isCorrect = option.isCorrect;

                      return (
                        <div
                          key={option.id}
                          className={`p-4 rounded-lg border-2 ${
                            isCorrect
                              ? "border-green-500 bg-green-50"
                              : isUserAnswer
                              ? "border-red-500 bg-red-50"
                              : "border-gray-200 bg-white"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={`${
                                isCorrect
                                  ? "text-green-900 font-semibold"
                                  : isUserAnswer
                                  ? "text-red-900"
                                  : "text-gray-700"
                              }`}
                            >
                              {option.content}
                            </span>
                            {isCorrect && (
                              <div className="flex items-center space-x-2">
                                <CheckCircle
                                  size={20}
                                  className="text-green-600"
                                />
                                <span className="text-sm font-medium text-green-700">
                                  Đáp án đúng
                                </span>
                              </div>
                            )}
                            {isUserAnswer && !isCorrect && (
                              <div className="flex items-center space-x-2">
                                <XCircle size={20} className="text-red-600" />
                                <span className="text-sm font-medium text-red-700">
                                  Bạn đã chọn
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {selectedExercise.questions[selectedResultQuestion].answerKeys
                    .length > 0 && (
                    <div className="ml-11 mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h5 className="font-semibold text-blue-900 mb-2">
                        Giải thích:
                      </h5>
                      <p className="text-blue-800 text-sm leading-relaxed">
                        {
                          selectedExercise.questions[selectedResultQuestion]
                            .answerKeys[0].answerText
                        }
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
