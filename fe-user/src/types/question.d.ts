interface QuestionOption {
  id: string;
  content: string;
  isCorrect: boolean;
  ordering?: number;
}

// Kiểu dữ liệu cho một câu hỏi
interface Question {
  id: string;
  exerciseId?: string;
  questionType:
    | "SINGLE_CHOICE"
    | "MULTIPLE_CHOICE"
    | "SHORT_ANSWER"
    | "LONG_ANSWER"
    | "FILL_BLANK"
    | "MATCHING";
  prompt: string;
  points: number;
  ordering?: number;
  options?: QuestionOption[]; // Dành cho câu trắc nghiệm
  answerKeys?: QuestionAnswerKey[];
}
