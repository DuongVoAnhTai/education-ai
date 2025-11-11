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
