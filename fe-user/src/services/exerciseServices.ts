import * as httpRequest from "@/utils/httpRequest";

export const getExercisesBySkillId = async (
  skillId: string
): Promise<{ exercises: Exercise[] } | { error: string }> => {
  if (!skillId) return { error: "Skill ID is required" };
  try {
    const res = await httpRequest.get(`skills/${skillId}/exercises`);
    return res;
  } catch (error: any) {
    return {
      error: error.response?.data?.error || "Failed to fetch exercises",
    };
  }
};

export const getExerciseById = async (
  skillId: string,
  exerciseId: string
): Promise<
  { exercise: Exercise & { questions: Question[] } } | { error: string }
> => {
  if (!skillId || !exerciseId)
    return { error: "Skill ID and Exercise ID is required" };
  try {
    const res = await httpRequest.get(
      `skills/${skillId}/exercises/${exerciseId}`
    );
    return res;
  } catch (error: any) {
    return {
      error: error.response?.data?.error || "Failed to fetch exercise details",
    };
  }
};

export const submitSingleAnswer = async (
  questionId: string,
  answer: { selectedOptionId?: string; answerText?: string }
): Promise<any> => {
  try {
    const res = await httpRequest.post(
      `questions/${questionId}/answers`,
      answer
    );
    return res;
  } catch (error: any) {
    return { error: error.response?.data?.error || "Failed to submit answer" };
  }
};

export const submitExercise = async (
  skillId: string,
  exerciseId: string,
  submissionData: {
    answers: SubmissionAnswer[];
    timeSpentSeconds: number;
  }
): Promise<any> => {
  try {
    const res = await httpRequest.post(
      `skills/${skillId}/exercises/${exerciseId}/submit`,
      submissionData
    );
    return res;
  } catch (error: any) {
    return {
      error: error.response?.data?.error,
    };
  }
};

export const getExerciseResult = async (
  skillId: string,
  exerciseId: string
): Promise<any> => {
  try {
    const res = await httpRequest.get(
      `skills/${skillId}/exercises/${exerciseId}/results`
    );
    return res;
  } catch (error: any) {
    return {
      error: error.response?.data?.error || "Failed to get exercise result",
    };
  }
};
