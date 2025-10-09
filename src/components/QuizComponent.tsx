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

const Lock = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
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

// ==================== TYPES ====================
interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  skillName: string;
  duration: number;
  totalQuestions: number;
  passingScore: number;
  difficulty: "easy" | "medium" | "hard";
  isLocked: boolean;
  bestScore?: number;
  attempts?: number;
}

interface QuizAttempt {
  attemptId: string;
  quizId: string;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  passed: boolean;
  timeSpent: number;
  aiEvaluation?: string;
  aiSuggestions?: string[];
  questions: (QuizQuestion & { userAnswer: number })[];
}

// ==================== MOCK DATA ====================
const MOCK_QUIZZES: Quiz[] = [
  {
    id: "quiz-1",
    title: "Next.js Server Components Fundamentals",
    description: "Kiểm tra kiến thức về Server Components, Client Components và cách sử dụng trong Next.js 14",
    skillName: "Next.js Development",
    duration: 15,
    totalQuestions: 10,
    passingScore: 70,
    difficulty: "medium",
    isLocked: false,
    bestScore: 85,
    attempts: 2,
  },
  {
    id: "quiz-2",
    title: "Python Machine Learning Basics",
    description: "Các khái niệm cơ bản về ML với Python: supervised learning, unsupervised learning",
    skillName: "Python AI/ML",
    duration: 20,
    totalQuestions: 15,
    passingScore: 70,
    difficulty: "easy",
    isLocked: false,
    bestScore: 90,
    attempts: 1,
  },
  {
    id: "quiz-3",
    title: "Database Design & Optimization",
    description: "Thiết kế database, normalization, indexing và query optimization",
    skillName: "Database",
    duration: 25,
    totalQuestions: 12,
    passingScore: 70,
    difficulty: "hard",
    isLocked: false,
  },
  {
    id: "quiz-4",
    title: "Advanced Deep Learning",
    description: "CNN, RNN, Transformers và các kiến trúc neural network tiên tiến",
    skillName: "Deep Learning",
    duration: 30,
    totalQuestions: 20,
    passingScore: 80,
    difficulty: "hard",
    isLocked: true,
  },
];

const MOCK_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    question: "Server Components trong Next.js 14 được render ở đâu?",
    options: ["Trên client browser", "Trên server", "Cả server và client", "Trong CDN"],
    correctAnswer: 1,
    explanation: "Server Components được render hoàn toàn trên server, không gửi JavaScript xuống client.",
  },
  {
    id: "q2",
    question: "Client Components được khai báo bằng cách nào?",
    options: ["Thêm 'use client' ở đầu file", "Thêm 'use server' ở đầu file", "Import từ 'next/client'", "Tự động phát hiện"],
    correctAnswer: 0,
    explanation: "Client Components cần được khai báo bằng directive 'use client' ở đầu file.",
  },
  {
    id: "q3",
    question: "Hooks như useState, useEffect có thể dùng trong component nào?",
    options: ["Chỉ Server Components", "Chỉ Client Components", "Cả hai loại", "Không dùng được hooks"],
    correctAnswer: 1,
    explanation: "Hooks chỉ có thể sử dụng trong Client Components vì chúng cần JavaScript runtime trên browser.",
  },
  {
    id: "q4",
    question: "Lợi ích chính của Server Components là gì?",
    options: ["Tăng interactivity", "Giảm bundle size", "Dễ debug hơn", "Hỗ trợ tốt hơn cho animations"],
    correctAnswer: 1,
    explanation: "Server Components không gửi JavaScript xuống client nên giúp giảm đáng kể bundle size.",
  },
  {
    id: "q5",
    question: "Fetch data trong Server Components nên làm như thế nào?",
    options: ["Dùng useEffect", "Dùng useState", "Dùng async/await trực tiếp", "Dùng SWR"],
    correctAnswer: 2,
    explanation: "Server Components có thể dùng async/await trực tiếp để fetch data vì chúng chạy trên server.",
  },
  {
    id: "q6",
    question: "Client Components có thể import Server Components không?",
    options: ["Có, tự do", "Không được", "Chỉ được nếu dùng dynamic import", "Có, nhưng cần thêm props đặc biệt"],
    correctAnswer: 1,
    explanation: "Client Components không thể import Server Components trực tiếp. Nhưng có thể nhận như children props.",
  },
  {
    id: "q7",
    question: "App Router mặc định render components theo cách nào?",
    options: ["Client-side", "Server-side", "Static", "Hybrid"],
    correctAnswer: 1,
    explanation: "Trong App Router, tất cả components mặc định là Server Components trừ khi được khai báo 'use client'.",
  },
  {
    id: "q8",
    question: "Streaming trong Next.js 14 hoạt động như thế nào?",
    options: ["Gửi toàn bộ HTML cùng lúc", "Gửi từng phần HTML khi sẵn sàng", "Chỉ gửi JSON", "Không hỗ trợ streaming"],
    correctAnswer: 1,
    explanation: "Streaming cho phép gửi từng phần UI xuống client ngay khi chúng sẵn sàng.",
  },
  {
    id: "q9",
    question: "Suspense boundaries được dùng để làm gì?",
    options: ["Bắt lỗi", "Hiển thị loading state", "Optimize images", "Handle routing"],
    correctAnswer: 1,
    explanation: "Suspense boundaries cho phép hiển thị fallback UI (loading state) trong khi đợi async operations.",
  },
  {
    id: "q10",
    question: "Metadata trong Next.js 14 được định nghĩa như thế nào?",
    options: ["Trong head tag", "Trong _app.js", "Export metadata object hoặc generateMetadata function", "Trong next.config.js"],
    correctAnswer: 2,
    explanation: "Next.js 14 App Router cho phép export metadata object hoặc generateMetadata function.",
  },
];

// ==================== MAIN COMPONENT ====================
export default function QuizComponent() {
  const [viewMode, setViewMode] = useState<"list" | "taking" | "result">("list");
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [quizAttempt, setQuizAttempt] = useState<QuizAttempt | null>(null);

  // Quiz List state
  const [filterDifficulty, setFilterDifficulty] = useState<"all" | "easy" | "medium" | "hard">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Quiz Taking state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quiz Result state
  const [showDetails, setShowDetails] = useState(false);
  const [selectedResultQuestion, setSelectedResultQuestion] = useState(0);

  // ==================== QUIZ LIST ====================
  const filteredQuizzes = MOCK_QUIZZES.filter((quiz) => {
    const matchesDifficulty = filterDifficulty === "all" || quiz.difficulty === filterDifficulty;
    const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         quiz.skillName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDifficulty && matchesSearch;
  });

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

  const handleStartQuiz = (quizId: string) => {
    setSelectedQuizId(quizId);
    const quiz = MOCK_QUIZZES.find((q) => q.id === quizId);
    setTimeRemaining((quiz?.duration || 15) * 60);
    setCurrentQuestion(0);
    setAnswers({});
    setViewMode("taking");
  };

  const handleViewResults = (quizId: string) => {
    const dummyAttempt: QuizAttempt = {
      attemptId: "prev-attempt",
      quizId,
      quizTitle: MOCK_QUIZZES.find((q) => q.id === quizId)?.title || "",
      score: 8,
      totalQuestions: 10,
      passed: true,
      timeSpent: 720,
      aiEvaluation: "Bạn đã làm rất tốt! Tiếp tục phát huy.",
      aiSuggestions: ["Học thêm về advanced topics", "Practice more coding challenges"],
      questions: MOCK_QUESTIONS.slice(0, 10).map((q, i) => ({
        ...q,
        userAnswer: i < 8 ? q.correctAnswer : (q.correctAnswer + 1) % q.options.length,
      })),
    };
    
    setQuizAttempt(dummyAttempt);
    setSelectedQuizId(quizId);
    setSelectedResultQuestion(0);
    setShowDetails(false);
    setViewMode("result");
  };

  // ==================== QUIZ TAKING ====================
  useEffect(() => {
    if (viewMode !== "taking") return;

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
  }, [viewMode]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerSelect = (optionIndex: number) => {
    setAnswers({
      ...answers,
      [MOCK_QUESTIONS[currentQuestion].id]: optionIndex,
    });
  };

  const handleNext = () => {
    if (currentQuestion < MOCK_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    const quiz = MOCK_QUIZZES.find((q) => q.id === selectedQuizId);
    if (!quiz) return;

    let correctCount = 0;
    MOCK_QUESTIONS.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const score = correctCount;
    const percentage = Math.round((score / MOCK_QUESTIONS.length) * 100);
    const passed = percentage >= quiz.passingScore;
    const timeSpent = quiz.duration * 60 - timeRemaining;

    const aiEvaluation = passed
      ? "Xuất sắc! Bạn đã nắm vững kiến thức. Hãy tiếp tục với các chủ đề nâng cao."
      : "Bạn đã cố gắng tốt! Tuy nhiên cần ôn lại một số khái niệm cơ bản.";

    const aiSuggestions = passed
      ? ["Thực hành xây dựng ứng dụng thực tế", "Tìm hiểu về best practices", "Học về performance optimization"]
      : ["Xem lại documentation", "Thực hành với các ví dụ đơn giản", "Tham gia community để học hỏi"];

    const detailedQuestions = MOCK_QUESTIONS.map((q) => ({
      ...q,
      userAnswer: answers[q.id] ?? -1,
    }));

    const attempt: QuizAttempt = {
      attemptId: `attempt-${Date.now()}`,
      quizId: selectedQuizId!,
      quizTitle: quiz.title,
      score,
      totalQuestions: MOCK_QUESTIONS.length,
      passed,
      timeSpent,
      aiEvaluation,
      aiSuggestions,
      questions: detailedQuestions,
    };

    setQuizAttempt(attempt);
    setIsSubmitting(false);
    setShowConfirmModal(false);
    setSelectedResultQuestion(0);
    setShowDetails(false);
    setViewMode("result");
  };

  const handleExitQuiz = () => {
    if (confirm("Bạn có chắc muốn thoát? Tiến trình sẽ không được lưu.")) {
      setViewMode("list");
      setSelectedQuizId(null);
    }
  };

  const getAnsweredCount = () => Object.keys(answers).length;
  const isQuestionAnswered = (questionId: string) => answers.hasOwnProperty(questionId);

  // ==================== QUIZ RESULT ====================
  const handleRetry = () => {
    const quiz = MOCK_QUIZZES.find((q) => q.id === selectedQuizId);
    setTimeRemaining((quiz?.duration || 15) * 60);
    setCurrentQuestion(0);
    setAnswers({});
    setViewMode("taking");
  };

  const handleBackToList = () => {
    setViewMode("list");
    setSelectedQuizId(null);
    setQuizAttempt(null);
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Bài kiểm tra</h2>
            <p className="text-gray-600 mt-1">Chọn bài kiểm tra để bắt đầu học tập</p>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-4 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex items-center space-x-2">
              <Filter size={18} className="text-gray-600" />
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả</option>
                <option value="easy">Dễ</option>
                <option value="medium">Trung bình</option>
                <option value="hard">Khó</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <BookOpen size={24} className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-700">{MOCK_QUIZZES.length}</p>
                <p className="text-xs text-blue-600">Tổng bài</p>
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
                  {MOCK_QUIZZES.filter((q) => q.bestScore && q.bestScore >= q.passingScore).length}
                </p>
                <p className="text-xs text-green-600">Đã pass</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <Target size={24} className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-700">
                  {MOCK_QUIZZES.filter((q) => !q.isLocked).length}
                </p>
                <p className="text-xs text-purple-600">Có thể làm</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <Lock size={24} className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-700">
                  {MOCK_QUIZZES.filter((q) => q.isLocked).length}
                </p>
                <p className="text-xs text-orange-600">Đang khóa</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quiz Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => {
            const diffColors = getDifficultyColor(quiz.difficulty);
            const hasPassed = quiz.bestScore !== undefined && quiz.bestScore >= quiz.passingScore;
            
            return (
              <div
                key={quiz.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
              >
                <div className={`h-2 bg-gradient-to-r ${
                  quiz.isLocked ? "from-gray-400 to-gray-500" :
                  quiz.difficulty === "easy" ? "from-green-400 to-green-500" :
                  quiz.difficulty === "medium" ? "from-yellow-400 to-yellow-500" :
                  "from-red-400 to-red-500"
                }`}></div>

                <div className="p-6">
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 flex-1 line-clamp-2">
                        {quiz.title}
                      </h3>
                      {quiz.isLocked && <Lock size={20} className="text-gray-400 ml-2" />}
                    </div>
                    <p className="text-sm text-gray-600">{quiz.skillName}</p>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{quiz.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${diffColors.bg} ${diffColors.text} border ${diffColors.border}`}>
                      {getDifficultyLabel(quiz.difficulty)}
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
                      <span>{quiz.duration} phút</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <BookOpen size={16} className="text-gray-400" />
                      <span>{quiz.totalQuestions} câu</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Target size={16} className="text-gray-400" />
                      <span>Pass: {quiz.passingScore}%</span>
                    </div>
                    {quiz.bestScore !== undefined && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Trophy size={16} className="text-yellow-500" />
                        <span className="font-semibold">{quiz.bestScore}%</span>
                      </div>
                    )}
                  </div>

                  {quiz.attempts !== undefined && quiz.attempts > 0 && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <p className="text-xs text-gray-600">
                        Đã làm <span className="font-semibold text-gray-900">{quiz.attempts}</span> lần
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStartQuiz(quiz.id)}
                      disabled={quiz.isLocked}
                      className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                        quiz.isLocked
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transform hover:scale-105"
                      }`}
                    >
                      <Play size={18} />
                      <span>{quiz.attempts && quiz.attempts > 0 ? "Làm lại" : "Bắt đầu"}</span>
                    </button>

                    {quiz.attempts !== undefined && quiz.attempts > 0 && (
                      <button
                        onClick={() => handleViewResults(quiz.id)}
                        className="px-4 py-2.5 border-2 border-purple-500 text-purple-600 font-medium rounded-lg hover:bg-purple-50 transition-all"
                      >
                        Kết quả
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredQuizzes.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <BookOpen size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Không tìm thấy bài kiểm tra</h3>
            <p className="text-gray-600">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
          </div>
        )}
      </div>
    );
  }

  if (viewMode === "taking") {
    const question = MOCK_QUESTIONS[currentQuestion];
    const selectedAnswer = answers[question.id];
    const progress = ((currentQuestion + 1) / MOCK_QUESTIONS.length) * 100;
    const answeredCount = getAnsweredCount();

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="max-w-5xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {MOCK_QUIZZES.find((q) => q.id === selectedQuizId)?.title}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Câu {currentQuestion + 1} / {MOCK_QUESTIONS.length}
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
                  onClick={handleExitQuiz}
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
                Đã trả lời: <span className="font-semibold text-gray-900">{answeredCount}/{MOCK_QUESTIONS.length}</span>
              </span>
              <span className="text-gray-600">
                Còn lại: <span className="font-semibold text-gray-900">{MOCK_QUESTIONS.length - answeredCount}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <div className="mb-8">
              <div className="flex items-start space-x-3 mb-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center font-bold">
                  {currentQuestion + 1}
                </div>
                <h2 className="text-xl font-semibold text-gray-900 flex-1">{question.question}</h2>
              </div>
            </div>

            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                    selectedAnswer === index
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${
                      selectedAnswer === index ? "border-blue-500 bg-blue-500" : "border-gray-300"
                    }`}>
                      {selectedAnswer === index && <div className="w-3 h-3 bg-white rounded-full"></div>}
                    </div>
                    <span className={`text-base ${selectedAnswer === index ? "font-semibold text-gray-900" : "text-gray-700"}`}>
                      {option}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-3">Điều hướng nhanh:</p>
              <div className="grid grid-cols-10 gap-2">
                {MOCK_QUESTIONS.map((q, index) => (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestion(index)}
                    className={`w-10 h-10 rounded-lg font-semibold text-sm transition-all duration-200 ${
                      index === currentQuestion
                        ? "bg-blue-500 text-white ring-2 ring-blue-300"
                        : isQuestionAnswered(q.id)
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
              disabled={currentQuestion === 0}
              className="flex items-center space-x-2 px-4 py-2 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={20} />
              <span>Câu trước</span>
            </button>

            {currentQuestion === MOCK_QUESTIONS.length - 1 ? (
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
                {answeredCount < MOCK_QUESTIONS.length ? (
                  <AlertCircle size={48} className="text-yellow-500 mx-auto mb-3" />
                ) : (
                  <CheckCircle size={48} className="text-green-500 mx-auto mb-3" />
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-2">Xác nhận nộp bài?</h3>
                <p className="text-gray-600">
                  Bạn đã trả lời <span className="font-semibold text-gray-900">{answeredCount}/{MOCK_QUESTIONS.length}</span> câu hỏi
                </p>
                {answeredCount < MOCK_QUESTIONS.length && (
                  <p className="text-yellow-600 text-sm mt-2">
                    Còn {MOCK_QUESTIONS.length - answeredCount} câu chưa trả lời!
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

  if (viewMode === "result" && quizAttempt) {
    const percentage = Math.round((quizAttempt.score / quizAttempt.totalQuestions) * 100);
    const correctCount = quizAttempt.questions.filter((q) => q.userAnswer === q.correctAnswer).length;
    const incorrectCount = quizAttempt.questions.length - correctCount;
    const grade = getGrade(percentage);

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mb-4">
                <Trophy size={40} className="text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{quizAttempt.quizTitle}</h1>
              <p className="text-gray-600">Kết quả bài kiểm tra của bạn</p>
            </div>

            <div className="flex items-center justify-center mb-8">
              <div className="relative">
                <svg className="w-48 h-48 transform -rotate-90">
                  <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-200" />
                  <circle
                    cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 88}`}
                    strokeDashoffset={`${2 * Math.PI * 88 * (1 - percentage / 100)}`}
                    className={quizAttempt.passed ? "text-green-500" : "text-red-500"}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-5xl font-bold ${quizAttempt.passed ? "text-green-600" : "text-red-600"}`}>
                    {percentage}%
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
                    <p className="text-2xl font-bold text-blue-700">{quizAttempt.score}/{quizAttempt.totalQuestions}</p>
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
                    <p className="text-lg font-bold text-purple-700">{Math.floor(quizAttempt.timeSpent / 60)}:{(quizAttempt.timeSpent % 60).toString().padStart(2, "0")}</p>
                    <p className="text-xs text-purple-600">Thời gian</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={`rounded-xl p-4 mb-6 ${quizAttempt.passed ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
              <div className="flex items-center space-x-3">
                {quizAttempt.passed ? (
                  <>
                    <CheckCircle size={24} className="text-green-600" />
                    <div>
                      <p className="font-semibold text-green-900">Chúc mừng! Bạn đã vượt qua bài kiểm tra!</p>
                      <p className="text-sm text-green-700">Bạn có thể tiếp tục học bài tiếp theo.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <XCircle size={24} className="text-red-600" />
                    <div>
                      <p className="font-semibold text-red-900">Chưa đạt! Hãy cố gắng lần sau.</p>
                      <p className="text-sm text-red-700">Bạn cần đạt ít nhất 70% để vượt qua.</p>
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

          {quizAttempt.aiEvaluation && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Lightbulb size={24} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Đánh giá từ AI</h3>
                  <p className="text-gray-700 leading-relaxed">{quizAttempt.aiEvaluation}</p>
                </div>
              </div>

              {quizAttempt.aiSuggestions && quizAttempt.aiSuggestions.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Gợi ý cải thiện:</h4>
                  <div className="space-y-2">
                    {quizAttempt.aiSuggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                        <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <p className="text-gray-700 text-sm">{suggestion}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {showDetails && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Chi tiết từng câu hỏi</h3>

              <div className="flex overflow-x-auto gap-2 mb-6 pb-2">
                {quizAttempt.questions.map((q, index) => (
                  <button
                    key={q.id}
                    onClick={() => setSelectedResultQuestion(index)}
                    className={`min-w-[48px] h-12 rounded-lg font-semibold text-sm transition-all ${
                      selectedResultQuestion === index
                        ? "bg-blue-500 text-white ring-2 ring-blue-300 scale-110"
                        : q.userAnswer === q.correctAnswer
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              {quizAttempt.questions[selectedResultQuestion] && (
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      {selectedResultQuestion + 1}
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 flex-1">
                      {quizAttempt.questions[selectedResultQuestion].question}
                    </h4>
                  </div>

                  <div className="space-y-3 ml-11">
                    {quizAttempt.questions[selectedResultQuestion].options.map((option, optIndex) => {
                      const isCorrect = optIndex === quizAttempt.questions[selectedResultQuestion].correctAnswer;
                      const isUserAnswer = optIndex === quizAttempt.questions[selectedResultQuestion].userAnswer;
                      
                      return (
                        <div
                          key={optIndex}
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
                              {option}
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

                  {quizAttempt.questions[selectedResultQuestion].explanation && (
                    <div className="ml-11 mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h5 className="font-semibold text-blue-900 mb-2">Giải thích:</h5>
                      <p className="text-blue-800 text-sm leading-relaxed">
                        {quizAttempt.questions[selectedResultQuestion].explanation}
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