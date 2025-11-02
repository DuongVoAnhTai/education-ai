"use client";

import { useState, useEffect } from "react";

// ==================== ICONS ====================
const BookOpen = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
  </svg>
);

const Clock = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const Play = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

const Trophy = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
    <path d="M4 22h16"></path>
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
  </svg>
);

const Target = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <circle cx="12" cy="12" r="6"></circle>
    <circle cx="12" cy="12" r="2"></circle>
  </svg>
);

const CheckCircle = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const XCircle = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="15" y1="9" x2="9" y2="15"></line>
    <line x1="9" y1="9" x2="15" y2="15"></line>
  </svg>
);

const ChevronLeft = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const ChevronRight = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const Send = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

const AlertCircle = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

const Lightbulb = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
    <path d="M9 18h6"></path>
    <path d="M10 22h4"></path>
  </svg>
);

const RefreshCw = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <polyline points="23 4 23 10 17 10"></polyline>
    <polyline points="1 20 1 14 7 14"></polyline>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
  </svg>
);

const Home = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const Filter = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
  </svg>
);

const Lock = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

// ==================== TYPES (Khớp với Prisma Schema) ====================
type QuestionType = "SINGLE_CHOICE" | "MULTIPLE_CHOICE" | "SHORT_ANSWER" | "LONG_ANSWER" | "FILL_BLANK" | "MATCHING";
type MatchType = "EXACT" | "CASE_INSENSITIVE" | "REGEX" | "CONTAINS";

interface QuestionOption {
  id: string;
  questionId: string;
  content: string;
  isCorrect: boolean;
  ordering: number | null;
}

interface QuestionAnswerKey {
  id: string;
  questionId: string;
  answerText: string;
  matchType: MatchType;
}

interface Question {
  id: string;
  exerciseId: string;
  questionType: QuestionType;
  prompt: string;
  points: number;
  ordering: number | null;
  options: QuestionOption[];
  answerKeys: QuestionAnswerKey[];
}

interface Exercise {
  id: string;
  skillId: string;
  title: string | null;
  description: string | null;
  ordering: number | null;
  timeLimitSeconds: number | null;
  passScore: number | null;
  questions: Question[];
}

interface Skill {
  id: string;
  title: string;
  description: string | null;
}

interface UserAnswer {
  id: string;
  userId: string;
  questionId: string;
  selectedOptionId: string | null;
  answerText: string | null;
  score: number | null;
  submittedAt: Date;
}

interface ExerciseAttempt {
  exerciseId: string;
  exerciseTitle: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  timeSpent: number;
  answers: Map<string, UserAnswer>;
}

// ==================== MOCK DATA (Khớp với Database Structure) ====================
const MOCK_SKILLS: Skill[] = [
  {
    id: "skill-1",
    title: "Next.js Development",
    description: "Học cách xây dựng ứng dụng với Next.js 14"
  },
  {
    id: "skill-2",
    title: "Python AI/ML",
    description: "Machine Learning cơ bản với Python"
  },
  {
    id: "skill-3",
    title: "Database Design",
    description: "Thiết kế và tối ưu hóa database"
  }
];

const MOCK_EXERCISES: Exercise[] = [
  {
    id: "ex-1",
    skillId: "skill-1",
    title: "Next.js Server Components Fundamentals",
    description: "Kiểm tra kiến thức về Server Components, Client Components và cách sử dụng trong Next.js 14",
    ordering: 1,
    timeLimitSeconds: 900,
    passScore: 70,
    questions: [
      {
        id: "q1",
        exerciseId: "ex-1",
        questionType: "SINGLE_CHOICE",
        prompt: "Server Components trong Next.js 14 được render ở đâu?",
        points: 1,
        ordering: 1,
        options: [
          { id: "q1-opt1", questionId: "q1", content: "Trên client browser", isCorrect: false, ordering: 1 },
          { id: "q1-opt2", questionId: "q1", content: "Trên server", isCorrect: true, ordering: 2 },
          { id: "q1-opt3", questionId: "q1", content: "Cả server và client", isCorrect: false, ordering: 3 },
          { id: "q1-opt4", questionId: "q1", content: "Trong CDN", isCorrect: false, ordering: 4 }
        ],
        answerKeys: [
          { id: "q1-key1", questionId: "q1", answerText: "Server Components được render hoàn toàn trên server, không gửi JavaScript xuống client.", matchType: "CONTAINS" }
        ]
      },
      {
        id: "q2",
        exerciseId: "ex-1",
        questionType: "SINGLE_CHOICE",
        prompt: "Client Components được khai báo bằng cách nào?",
        points: 1,
        ordering: 2,
        options: [
          { id: "q2-opt1", questionId: "q2", content: "Thêm 'use client' ở đầu file", isCorrect: true, ordering: 1 },
          { id: "q2-opt2", questionId: "q2", content: "Thêm 'use server' ở đầu file", isCorrect: false, ordering: 2 },
          { id: "q2-opt3", questionId: "q2", content: "Import từ 'next/client'", isCorrect: false, ordering: 3 },
          { id: "q2-opt4", questionId: "q2", content: "Tự động phát hiện", isCorrect: false, ordering: 4 }
        ],
        answerKeys: [
          { id: "q2-key1", questionId: "q2", answerText: "Client Components cần được khai báo bằng directive 'use client' ở đầu file.", matchType: "CONTAINS" }
        ]
      },
      {
        id: "q3",
        exerciseId: "ex-1",
        questionType: "SINGLE_CHOICE",
        prompt: "Hooks như useState, useEffect có thể dùng trong component nào?",
        points: 1,
        ordering: 3,
        options: [
          { id: "q3-opt1", questionId: "q3", content: "Chỉ Server Components", isCorrect: false, ordering: 1 },
          { id: "q3-opt2", questionId: "q3", content: "Chỉ Client Components", isCorrect: true, ordering: 2 },
          { id: "q3-opt3", questionId: "q3", content: "Cả hai loại", isCorrect: false, ordering: 3 },
          { id: "q3-opt4", questionId: "q3", content: "Không dùng được hooks", isCorrect: false, ordering: 4 }
        ],
        answerKeys: [
          { id: "q3-key1", questionId: "q3", answerText: "Hooks chỉ có thể sử dụng trong Client Components vì chúng cần JavaScript runtime trên browser.", matchType: "CONTAINS" }
        ]
      }
    ]
  },
  {
    id: "ex-2",
    skillId: "skill-2",
    title: "Python Machine Learning Basics",
    description: "Các khái niệm cơ bản về ML với Python: supervised learning, unsupervised learning",
    ordering: 1,
    timeLimitSeconds: 1200,
    passScore: 70,
    questions: [
      {
        id: "q4",
        exerciseId: "ex-2",
        questionType: "SINGLE_CHOICE",
        prompt: "Supervised Learning khác với Unsupervised Learning ở điểm nào?",
        points: 1,
        ordering: 1,
        options: [
          { id: "q4-opt1", questionId: "q4", content: "Có nhãn dữ liệu", isCorrect: true, ordering: 1 },
          { id: "q4-opt2", questionId: "q4", content: "Không có nhãn", isCorrect: false, ordering: 2 },
          { id: "q4-opt3", questionId: "q4", content: "Tốc độ xử lý", isCorrect: false, ordering: 3 },
          { id: "q4-opt4", questionId: "q4", content: "Loại thuật toán", isCorrect: false, ordering: 4 }
        ],
        answerKeys: [
          { id: "q4-key1", questionId: "q4", answerText: "Supervised learning sử dụng dữ liệu có nhãn để training model.", matchType: "CONTAINS" }
        ]
      }
    ]
  }
];

// ==================== COMPONENT ====================
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

  if (viewMode === "taking" && selectedExercise) {
    const question = selectedExercise.questions[currentQuestionIndex];
    const selectedOptionId = userAnswers.get(question.id);
    const progress = ((currentQuestionIndex + 1) / selectedExercise.questions.length) * 100;
    const answeredCount = getAnsweredCount();

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="max-w-5xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{selectedExercise.title}</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Câu {currentQuestionIndex + 1} / {selectedExercise.questions.length}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  timeRemaining < 300 ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                }`}>
                  <Clock size={20} />
                  <span className="font-semibold">{formatTime(timeRemaining)}</span>
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
                Đã trả lời: <span className="font-semibold text-gray-900">{answeredCount}/{selectedExercise.questions.length}</span>
              </span>
              <span className="text-gray-600">
                Còn lại: <span className="font-semibold text-gray-900">{selectedExercise.questions.length - answeredCount}</span>
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
                <h2 className="text-xl font-semibold text-gray-900 flex-1">{question.prompt}</h2>
              </div>
              <div className="ml-11">
                <span className="text-sm text-gray-500">Điểm: {question.points}</span>
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
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${
                      selectedOptionId === option.id ? "border-blue-500 bg-blue-500" : "border-gray-300"
                    }`}>
                      {selectedOptionId === option.id && <div className="w-3 h-3 bg-white rounded-full"></div>}
                    </div>
                    <span className={`text-base ${selectedOptionId === option.id ? "font-semibold text-gray-900" : "text-gray-700"}`}>
                      {option.content}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-3">Điều hướng nhanh:</p>
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
                  <AlertCircle size={48} className="text-yellow-500 mx-auto mb-3" />
                ) : (
                  <CheckCircle size={48} className="text-green-500 mx-auto mb-3" />
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-2">Xác nhận nộp bài?</h3>
                <p className="text-gray-600">
                  Bạn đã trả lời <span className="font-semibold text-gray-900">{answeredCount}/{selectedExercise.questions.length}</span> câu hỏi
                </p>
                {answeredCount < selectedExercise.questions.length && (
                  <p className="text-yellow-600 text-sm mt-2">
                    Còn {selectedExercise.questions.length - answeredCount} câu chưa trả lời!
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

  if (viewMode === "result" && attempt && selectedExercise) {
    const grade = getGrade(attempt.percentage);
    const correctCount = Array.from(attempt.answers.values()).filter(ans => ans.score && ans.score > 0).length;
    const incorrectCount = selectedExercise.questions.length - correctCount;

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mb-4">
                <Trophy size={40} className="text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{attempt.exerciseTitle}</h1>
              <p className="text-gray-600">Kết quả bài tập của bạn</p>
            </div>

            <div className="flex items-center justify-center mb-8">
              <div className="relative">
                <svg className="w-48 h-48 transform -rotate-90">
                  <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-200" />
                  <circle
                    cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 88}`}
                    strokeDashoffset={`${2 * Math.PI * 88 * (1 - attempt.percentage / 100)}`}
                    className={attempt.passed ? "text-green-500" : "text-red-500"}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-5xl font-bold ${attempt.passed ? "text-green-600" : "text-red-600"}`}>
                    {attempt.percentage}%
                  </span>
                  <span className={`text-sm font-medium mt-1 px-3 py-1 rounded-full ${grade.bg} ${grade.color}`}>
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
                    <p className="text-2xl font-bold text-green-700">{correctCount}</p>
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
                    <p className="text-2xl font-bold text-red-700">{incorrectCount}</p>
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
                    <p className="text-2xl font-bold text-blue-700">{attempt.totalScore}/{attempt.maxScore}</p>
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
                    <p className="text-lg font-bold text-purple-700">{Math.floor(attempt.timeSpent / 60)}:{(attempt.timeSpent % 60).toString().padStart(2, "0")}</p>
                    <p className="text-xs text-purple-600">Thời gian</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={`rounded-xl p-4 mb-6 ${attempt.passed ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
              <div className="flex items-center space-x-3">
                {attempt.passed ? (
                  <>
                    <CheckCircle size={24} className="text-green-600" />
                    <div>
                      <p className="font-semibold text-green-900">Chúc mừng! Bạn đã hoàn thành bài tập!</p>
                      <p className="text-sm text-green-700">Bạn có thể tiếp tục với bài tập tiếp theo.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <XCircle size={24} className="text-red-600" />
                    <div>
                      <p className="font-semibold text-red-900">Chưa đạt! Hãy cố gắng lần sau.</p>
                      <p className="text-sm text-red-700">Bạn cần đạt ít nhất {selectedExercise.passScore}% để vượt qua.</p>
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
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Chi tiết từng câu hỏi</h3>

              <div className="flex overflow-x-auto gap-2 mb-6 pb-2">
                {selectedExercise.questions.map((q, index) => {
                  const userAnswer = attempt.answers.get(q.id);
                  const isCorrect = userAnswer && userAnswer.score && userAnswer.score > 0;
                  
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
                      {selectedExercise.questions[selectedResultQuestion].prompt}
                    </h4>
                  </div>

                  <div className="space-y-3 ml-11">
                    {selectedExercise.questions[selectedResultQuestion].options.map((option) => {
                      const userAnswer = attempt.answers.get(selectedExercise.questions[selectedResultQuestion].id);
                      const isUserAnswer = userAnswer?.selectedOptionId === option.id;
                      const isCorrect = option.isCorrect;
                      
                      return (
                        <div
                          key={option.id}
                          className={`p-4 rounded-lg border-2 ${
                            isCorrect ? "border-green-500 bg-green-50" :
                            isUserAnswer ? "border-red-500 bg-red-50" :
                            "border-gray-200 bg-white"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`${
                              isCorrect ? "text-green-900 font-semibold" :
                              isUserAnswer ? "text-red-900" : "text-gray-700"
                            }`}>
                              {option.content}
                            </span>
                            {isCorrect && (
                              <div className="flex items-center space-x-2">
                                <CheckCircle size={20} className="text-green-600" />
                                <span className="text-sm font-medium text-green-700">Đáp án đúng</span>
                              </div>
                            )}
                            {isUserAnswer && !isCorrect && (
                              <div className="flex items-center space-x-2">
                                <XCircle size={20} className="text-red-600" />
                                <span className="text-sm font-medium text-red-700">Bạn đã chọn</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {selectedExercise.questions[selectedResultQuestion].answerKeys.length > 0 && (
                    <div className="ml-11 mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h5 className="font-semibold text-blue-900 mb-2">Giải thích:</h5>
                      <p className="text-blue-800 text-sm leading-relaxed">
                        {selectedExercise.questions[selectedResultQuestion].answerKeys[0].answerText}
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