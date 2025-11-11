"use client"

import { useState } from "react";

export default function QuizComponent() {
  const [viewMode, setViewMode] = useState<"list" | "taking" | "result">("list");
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Map<string, string>>(new Map());
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attempt, setAttempt] = useState<ExerciseAttempt | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedResultQuestion, setSelectedResultQuestion] = useState(0);

  // Mock user attempts data
  const [userAttempts] = useState<Map<string, { bestScore: number; attempts: number }>>(
    new Map([
      ["ex-1", { bestScore: 85, attempts: 2 }],
      ["ex-2", { bestScore: 90, attempts: 1 }]
    ])
  );

  const [searchQuery, setSearchQuery] = useState("");

  // ==================== EXERCISE LIST ====================
  const getSkillForExercise = (skillId: string) => {
    return MOCK_SKILLS.find(s => s.id === skillId);
  };

  const getDifficultyFromPassScore = (passScore: number | null): "easy" | "medium" | "hard" => {
    if (!passScore) return "medium";
    if (passScore < 60) return "easy";
    if (passScore < 80) return "medium";
    return "hard";
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return { bg: "bg-green-100", text: "text-green-700", border: "border-green-300" };
      case "medium": return { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-300" };
      case "hard": return { bg: "bg-red-100", text: "text-red-700", border: "border-red-300" };
      default: return { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-300" };
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "Dễ";
      case "medium": return "Trung bình";
      case "hard": return "Khó";
      default: return difficulty;
    }
  };

  const filteredExercises = MOCK_EXERCISES.filter(ex => {
    const skill = getSkillForExercise(ex.skillId);
    const matchesSearch = ex.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         skill?.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleStartExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setTimeRemaining(exercise.timeLimitSeconds || 900);
    setCurrentQuestionIndex(0);
    setUserAnswers(new Map());
    setViewMode("taking");
  };

  // ==================== TAKING EXERCISE ====================
  useEffect(() => {
    if (viewMode !== "taking" || !selectedExercise) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
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
    setUserAnswers(prev => {
      const newMap = new Map(prev);
      newMap.set(questionId, optionId);
      return newMap;
    });
  };

  const handleNext = () => {
    if (selectedExercise && currentQuestionIndex < selectedExercise.questions.length - 1) {
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

    selectedExercise.questions.forEach(question => {
      maxScore += question.points;
      const selectedOptionId = userAnswers.get(question.id);
      
      if (selectedOptionId) {
        const selectedOption = question.options.find(opt => opt.id === selectedOptionId);
        const score = selectedOption?.isCorrect ? question.points : 0;
        totalScore += score;

        answers.set(question.id, {
          id: `ans-${Date.now()}-${question.id}`,
          userId: "current-user",
          questionId: question.id,
          selectedOptionId,
          answerText: null,
          score,
          submittedAt: new Date()
        });
      }
    });

    const percentage = Math.round((totalScore / maxScore) * 100);
    const passed = percentage >= (selectedExercise.passScore || 70);
    const timeSpent = (selectedExercise.timeLimitSeconds || 900) - timeRemaining;

    const newAttempt: ExerciseAttempt = {
      exerciseId: selectedExercise.id,
      exerciseTitle: selectedExercise.title || "Bài tập",
      totalScore,
      maxScore,
      percentage,
      passed,
      timeSpent,
      answers
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
    if (percentage >= 90) return { label: "Xuất sắc", color: "text-green-600", bg: "bg-green-100" };
    if (percentage >= 80) return { label: "Giỏi", color: "text-blue-600", bg: "bg-blue-100" };
    if (percentage >= 70) return { label: "Khá", color: "text-yellow-600", bg: "bg-yellow-100" };
    if (percentage >= 60) return { label: "Trung bình", color: "text-orange-600", bg: "bg-orange-100" };
    return { label: "Cần cải thiện", color: "text-red-600", bg: "bg-red-100" };
  };

  // ==================== RENDER ====================
  if (viewMode === "list") {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Bài tập & Kiểm tra</h2>
              <p className="text-gray-600 mt-1">Chọn bài tập để bắt đầu luyện tập</p>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="text"
                placeholder="Tìm kiếm bài tập..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <BookOpen size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-700">{MOCK_EXERCISES.length}</p>
                  <p className="text-xs text-blue-600">Tổng bài tập</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <Trophy size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-700">
                    {Array.from(userAttempts.entries()).filter(([_, data]) => data.bestScore >= 70).length}
                  </p>
                  <p className="text-xs text-green-600">Đã hoàn thành</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Target size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-700">{MOCK_SKILLS.length}</p>
                  <p className="text-xs text-purple-600">Kỹ năng</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Clock size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-700">
                    {MOCK_EXERCISES.reduce((sum, ex) => sum + (ex.questions?.length || 0), 0)}
                  </p>
                  <p className="text-xs text-orange-600">Câu hỏi</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExercises.map(exercise => {
              const skill = getSkillForExercise(exercise.skillId);
              const difficulty = getDifficultyFromPassScore(exercise.passScore);
              const diffColors = getDifficultyColor(difficulty);
              const userAttempt = userAttempts.get(exercise.id);
              const hasPassed = userAttempt && userAttempt.bestScore >= (exercise.passScore || 70);

              return (
                <div
                  key={exercise.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
                >
                  <div className={`h-2 bg-gradient-to-r ${
                    difficulty === "easy" ? "from-green-400 to-green-500" :
                    difficulty === "medium" ? "from-yellow-400 to-yellow-500" :
                    "from-red-400 to-red-500"
                  }`}></div>

                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {exercise.title}
                      </h3>
                      <p className="text-sm text-gray-600">{skill?.title}</p>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{exercise.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${diffColors.bg} ${diffColors.text} border ${diffColors.border}`}>
                        {getDifficultyLabel(difficulty)}
                      </span>
                      {hasPassed && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-300 flex items-center space-x-1">
                          <Trophy size={12} />
                          <span>Đã pass</span>
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock size={16} className="text-gray-400" />
                        <span>{Math.floor((exercise.timeLimitSeconds || 0) / 60)} phút</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <BookOpen size={16} className="text-gray-400" />
                        <span>{exercise.questions?.length || 0} câu</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Target size={16} className="text-gray-400" />
                        <span>Pass: {exercise.passScore}%</span>
                      </div>
                      {userAttempt && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Trophy size={16} className="text-yellow-500" />
                          <span className="font-semibold">{userAttempt.bestScore}%</span>
                        </div>
                      )}
                    </div>

                    {userAttempt && userAttempt.attempts > 0 && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <p className="text-xs text-gray-600">
                          Đã làm <span className="font-semibold text-gray-900">{userAttempt.attempts}</span> lần
                        </p>
                      </div>
                    )}

                    <button
                      onClick={() => handleStartExercise(exercise)}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg font-medium transition-all bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      <Play size={18} />
                      <span>{userAttempt && userAttempt.attempts > 0 ? "Làm lại" : "Bắt đầu"}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredExercises.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <BookOpen size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Không tìm thấy bài tập</h3>
              <p className="text-gray-600">Thử thay đổi từ khóa tìm kiếm</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}