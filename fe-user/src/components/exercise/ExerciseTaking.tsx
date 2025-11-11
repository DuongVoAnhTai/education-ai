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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attempt, setAttempt] = useState<ExerciseAttempt | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedResultQuestion, setSelectedResultQuestion] = useState(0);

  // ==================== TAKING EXERCISE ====================
  useEffect(() => {
    if (viewMode !== "taking" || !selectedExercise) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [viewMode, selectedExercise]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerSelect = (questionId: string, optionId: string) => {
    setUserAnswers((prev) => {
      const newMap = new Map(prev);
      newMap.set(questionId, optionId);
      return newMap;
    });
  };

  const handleNext = () => {
    if (
      selectedExercise &&
      currentQuestionIndex < selectedExercise.questions.length - 1
    ) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    if (!selectedExercise) return;

    setIsSubmitting(true);

    let totalScore = 0;
    let maxScore = 0;
    const answers = new Map<string, UserAnswer>();

    selectedExercise.questions.forEach((question) => {
      maxScore += question.points;
      const selectedOptionId = userAnswers.get(question.id);

      if (selectedOptionId) {
        const selectedOption = question.options.find(
          (opt) => opt.id === selectedOptionId
        );
        const score = selectedOption?.isCorrect ? question.points : 0;
        totalScore += score;

        answers.set(question.id, {
          id: `ans-${Date.now()}-${question.id}`,
          userId: "current-user",
          questionId: question.id,
          selectedOptionId,
          answerText: null,
          score,
          submittedAt: new Date(),
        });
      }
    });

    const percentage = Math.round((totalScore / maxScore) * 100);
    const passed = percentage >= (selectedExercise.passScore || 70);
    const timeSpent =
      (selectedExercise.timeLimitSeconds || 900) - timeRemaining;

    const newAttempt: ExerciseAttempt = {
      exerciseId: selectedExercise.id,
      exerciseTitle: selectedExercise.title || "Bài tập",
      totalScore,
      maxScore,
      percentage,
      passed,
      timeSpent,
      answers,
    };

    setAttempt(newAttempt);
    setIsSubmitting(false);
    setShowConfirmModal(false);
    setSelectedResultQuestion(0);
    setShowDetails(false);
    setViewMode("result");
  };

  const handleExitExercise = () => {
    if (confirm("Bạn có chắc muốn thoát? Tiến trình sẽ không được lưu.")) {
      setViewMode("list");
      setSelectedExercise(null);
    }
  };

  const getAnsweredCount = () => userAnswers.size;

  if (viewMode === "taking" && selectedExercise) {
    const question = selectedExercise.questions[currentQuestionIndex];
    const selectedOptionId = userAnswers.get(question.id);
    const progress =
      ((currentQuestionIndex + 1) / selectedExercise.questions.length) * 100;
    const answeredCount = getAnsweredCount();

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="max-w-5xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {selectedExercise.title}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Câu {currentQuestionIndex + 1} /{" "}
                  {selectedExercise.questions.length}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                    timeRemaining < 300
                      ? "bg-red-100 text-red-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  <Clock size={20} />
                  <span className="font-semibold">
                    {formatTime(timeRemaining)}
                  </span>
                </div>

                <button
                  onClick={handleExitExercise}
                  className="px-4 py-2 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Thoát
                </button>
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between mt-3 text-sm">
              <span className="text-gray-600">
                Đã trả lời:{" "}
                <span className="font-semibold text-gray-900">
                  {answeredCount}/{selectedExercise.questions.length}
                </span>
              </span>
              <span className="text-gray-600">
                Còn lại:{" "}
                <span className="font-semibold text-gray-900">
                  {selectedExercise.questions.length - answeredCount}
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <div className="mb-8">
              <div className="flex items-start space-x-3 mb-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center font-bold">
                  {currentQuestionIndex + 1}
                </div>
                <h2 className="text-xl font-semibold text-gray-900 flex-1">
                  {question.prompt}
                </h2>
              </div>
              <div className="ml-11">
                <span className="text-sm text-gray-500">
                  Điểm: {question.points}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {question.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleAnswerSelect(question.id, option.id)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                    selectedOptionId === option.id
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${
                        selectedOptionId === option.id
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedOptionId === option.id && (
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span
                      className={`text-base ${
                        selectedOptionId === option.id
                          ? "font-semibold text-gray-900"
                          : "text-gray-700"
                      }`}
                    >
                      {option.content}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Điều hướng nhanh:
              </p>
              <div className="grid grid-cols-10 gap-2">
                {selectedExercise.questions.map((q, index) => (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`w-10 h-10 rounded-lg font-semibold text-sm transition-all duration-200 ${
                      index === currentQuestionIndex
                        ? "bg-blue-500 text-white ring-2 ring-blue-300"
                        : userAnswers.has(q.id)
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border-t border-gray-200 sticky bottom-0 shadow-lg">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="flex items-center space-x-2 px-4 py-2 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={20} />
              <span>Câu trước</span>
            </button>

            {currentQuestionIndex === selectedExercise.questions.length - 1 ? (
              <button
                onClick={() => setShowConfirmModal(true)}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg shadow-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105"
              >
                <Send size={20} />
                <span>Nộp bài</span>
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
              >
                <span>Câu tiếp theo</span>
                <ChevronRight size={20} />
              </button>
            )}
          </div>
        </div>

        {showConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
              <div className="text-center mb-6">
                {answeredCount < selectedExercise.questions.length ? (
                  <AlertCircle
                    size={48}
                    className="text-yellow-500 mx-auto mb-3"
                  />
                ) : (
                  <CheckCircle
                    size={48}
                    className="text-green-500 mx-auto mb-3"
                  />
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Xác nhận nộp bài?
                </h3>
                <p className="text-gray-600">
                  Bạn đã trả lời{" "}
                  <span className="font-semibold text-gray-900">
                    {answeredCount}/{selectedExercise.questions.length}
                  </span>{" "}
                  câu hỏi
                </p>
                {answeredCount < selectedExercise.questions.length && (
                  <p className="text-yellow-600 text-sm mt-2">
                    Còn {selectedExercise.questions.length - answeredCount} câu
                    chưa trả lời!
                  </p>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  disabled={isSubmitting}
                  className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Tiếp tục làm
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-green-700 shadow-lg transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "Đang nộp..." : "Nộp bài"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}
