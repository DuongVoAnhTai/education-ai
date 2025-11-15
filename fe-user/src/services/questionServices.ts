import * as httpRequest from "@/utils/httpRequest";

export const createQuestion = async (
  skillId,
  exerciseId: string,
  data: any
): Promise<any> => {
  try {
    // API này cần được tạo: POST /api/v1/exercises/:exerciseId/questions
    const res = await httpRequest.post(
      `skills/${skillId}/exercises/${exerciseId}/questions`,
      data
    );
    return res;
  } catch (error: any) {
    return {
      error: error.response?.data?.error || "Failed to create question",
    };
  }
};

export const updateQuestion = async (
  questionId: string,
  data: any
): Promise<any> => {
  try {
    // API này cần được tạo: PUT /api/v1/questions/:questionId
    const res = await httpRequest.put(`questions/${questionId}`, data);
    return res;
  } catch (error: any) {
    return {
      error: error.response?.data?.error || "Failed to update question",
    };
  }
};

export const deleteQuestion = async (questionId: string): Promise<any> => {
  try {
    // API này cần được tạo: DELETE /api/v1/questions/:questionId
    const res = await httpRequest.del(`questions/${questionId}`);
    return res;
  } catch (error: any) {
    return {
      error: error.response?.data?.error || "Failed to delete question",
    };
  }
};

// --- Question Options (cho câu trắc nghiệm) ---
export const createOptionForQuestion = async (
  questionId: string,
  data: any
): Promise<any> => {
  try {
    const res = await httpRequest.post(`questions/${questionId}/options`, data);
    return res;
  } catch (error: any) {
    return { error: error.response?.data?.error || "Failed to create option" };
  }
};

export const updateOption = async (
  questionId: string,
  optionId: string,
  data: any
): Promise<any> => {
  try {
    const res = await httpRequest.put(
      `questions/${questionId}/options/${optionId}`,
      data
    );
    return res;
  } catch (error: any) {
    return { error: error.response?.data?.error || "Failed to update option" };
  }
};

export const deleteOption = async (
  questionId: string,
  optionId: string
): Promise<any> => {
  try {
    const res = await httpRequest.del(
      `questions/${questionId}/options/${optionId}`
    );
    return res;
  } catch (error: any) {
    return { error: error.response?.data?.error || "Failed to delete option" };
  }
};

// --- Question Answer Keys (cho câu tự luận ngắn) ---

export const createAnswerKeyForQuestion = async (
  questionId: string,
  data: any
): Promise<any> => {
  try {
    const res = await httpRequest.post(
      `questions/${questionId}/answer-keys`,
      data
    );
    return res;
  } catch (error: any) {
    return { error: error.response?.data?.error || "Failed to create key" };
  }
};

export const updateAnswerKey = async (
  questionId: string,
  keyId: string,
  data: any
): Promise<any> => {
  try {
    const res = await httpRequest.put(
      `questions/${questionId}/answer-keys/${keyId}`,
      data
    );
    return res;
  } catch (error: any) {
    return { error: error.response?.data?.error || "Failed to update key" };
  }
};

export const deleteAnswerKey = async (
  questionId: string,
  keyId: string
): Promise<any> => {
  try {
    const res = await httpRequest.del(
      `questions/${questionId}/answer-keys/${keyId}`
    );
    return res;
  } catch (error: any) {
    return { error: error.response?.data?.error || "Failed to delete key" };
  }
};
