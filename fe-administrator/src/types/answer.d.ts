interface SubmissionAnswer {
  questionId: string;
  selectedOptionId?: string;
  // selectedOptionIds?: string[]; // Cho MULTIPLE_CHOICE
  answerText?: string;
  // matchingPairs?: { stemId: string; optionId: string }[]; // Cho MATCHING
}
