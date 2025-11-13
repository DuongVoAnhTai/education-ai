type UserSubmissionAnswer = {
  questionId: string;
  selectedOptionId?: string; // Cho SINGLE_CHOICE
  // selectedOptionIds?: string[]; // Cho MULTIPLE_CHOICE
  answerText?: string; // Cho các loại text
  // matchingPairs?: { stemId: string; optionId: string }[]; // Cho MATCHING
};
