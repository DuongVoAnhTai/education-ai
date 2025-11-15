interface Exercise {
  id: string;
  skillId?: string;
  title: string;
  description?: string;
  ordering?: number;
  timeLimitSeconds?: number;
  passScore?: number;
  createdAt: string;
  updatedAt: string;
  _count?: {
    questions: number;
  };
}

interface ExerciseResult {
  exerciseId: string;
  score: number;
  totalPoints: number;
  isPassed: boolean;
}

interface ExerciseResultData {
  exerciseId: string;
  totalPoints: number;
  score: number;
  correctCount: number;
  wrongCount: number;
  answers: any[]; // Cần định nghĩa kiểu chi tiết hơn cho UserAnswer
}

interface ExerciseResultHistoryItem {
  exerciseId: string;
  exerciseTitle: string;
  skillTitle: string;
  score: number;
  totalPoints: number;
  timeSpentSeconds?: number | null; // Cho phép null hoặc undefined
  submittedAt: Date;
}

interface ExerciseServiceResponse {
  exercise?: Exercise;
  message?: string; // For delete operations
  error?: string;
}
