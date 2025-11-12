"use client";

import { useState } from "react";
import * as Icon from "@/assets/Image/exerciseIcon";

interface ExerciseResultDetailProps {
  exercise: Exercise & { questions: Question[] };
  result: ExerciseResultData;
}

export default function ExerciseResultDetail({
  exercise,
  result,
}: ExerciseResultDetailProps) {
  const [selectedResultQuestionIndex, setSelectedResultQuestionIndex] =
    useState(0);

  // Tạo một Map để tra cứu câu trả lời của user cho từng câu hỏi
  const userAnswersMap = new Map(
    result.answers.map((ans) => [ans.questionId, ans])
  );
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">
        Chi tiết từng câu hỏi
      </h3>

      <div className="flex overflow-x-auto gap-2 mb-6 pb-2">
        {exercise.questions.map((q, index) => {
          const userAnswer = userAnswersMap.get(q.id);
          const isCorrect = userAnswer && userAnswer.score > 0;

          return (
            <button
              key={q.id}
              onClick={() => setSelectedResultQuestionIndex(index)}
              className={`min-w-[48px] h-12 rounded-lg font-semibold text-sm transition-all cursor-pointer ${
                selectedResultQuestionIndex === index
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

      {(() => {
        const question = exercise.questions[selectedResultQuestionIndex];
        if (!question) return null;
        const userAnswer = userAnswersMap.get(question.id);
        const questionType = question.questionType;

        return (
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                {selectedResultQuestionIndex + 1}
              </div>
              <h4 className="text-lg font-semibold text-gray-900 flex-1">
                {question.prompt}
              </h4>
            </div>

            {(questionType === "SINGLE_CHOICE" ||
              questionType === "MULTIPLE_CHOICE") && (
              <div className="space-y-3 ml-11">
                {question.options?.map((option) => {
                  const isUserAnswer =
                    userAnswer?.selectedOptionId === option.id;
                  const isCorrect = option.isCorrect;

                  return (
                    <div
                      key={option.id}
                      className={`p-4 rounded-lg border-2 ${
                        isCorrect
                          ? "border-green-500 bg-green-50"
                          : isUserAnswer
                          ? "border-red-500 bg-red-50"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`${
                            isCorrect
                              ? "text-green-900 font-semibold"
                              : isUserAnswer
                              ? "text-red-900"
                              : "text-gray-700"
                          }`}
                        >
                          {option.content}
                        </span>
                        {isCorrect && (
                          <div className="flex items-center space-x-2">
                            <Icon.CheckCircle
                              size={20}
                              className="text-green-600"
                            />
                            <span className="text-sm font-medium text-green-700">
                              Đáp án đúng
                            </span>
                          </div>
                        )}
                        {isUserAnswer && !isCorrect && (
                          <div className="flex items-center space-x-2">
                            <Icon.XCircle size={20} className="text-red-600" />
                            <span className="text-sm font-medium text-red-700">
                              Bạn đã chọn
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {(questionType === "SHORT_ANSWER" ||
              questionType === "FILL_BLANK") && (
              <div className="ml-11 space-y-4">
                {/* Câu trả lời của người dùng */}
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Câu trả lời của bạn
                  </label>
                  <div
                    className={`mt-1 p-3 rounded-lg border-2 ${
                      (userAnswer?.score ?? 0) > 0
                        ? "bg-green-50 border-green-500"
                        : "bg-red-50 border-red-500"
                    }`}
                  >
                    <p
                      className={`${
                        (userAnswer?.score ?? 0) > 0
                          ? "text-green-900"
                          : "text-red-900"
                      }`}
                    >
                      {userAnswer?.answerText || (
                        <span className="italic">Chưa trả lời</span>
                      )}
                    </p>
                  </div>
                </div>
                {/* Đáp án đúng */}
                {question.answerKeys && question.answerKeys.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Đáp án đúng
                    </label>
                    <div className="mt-1 p-3 rounded-lg bg-gray-100 border border-gray-200">
                      <ul className="list-disc list-inside text-gray-700">
                        {question.answerKeys.map((key) => (
                          <li key={key.id}>{key.answerText}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* C. Render cho câu tự luận dài (LONG_ANSWER) */}
            {questionType === "LONG_ANSWER" && (
              <div className="ml-11">
                <label className="text-sm font-medium text-gray-500">
                  Câu trả lời của bạn
                </label>
                <div className="mt-1 p-3 rounded-lg bg-gray-100 border border-gray-200">
                  <p className="text-gray-800 whitespace-pre-wrap">
                    {userAnswer?.answerText || (
                      <span className="italic">Chưa trả lời</span>
                    )}
                  </p>
                  <p className="text-xs text-blue-600 mt-2 italic">
                    Câu trả lời này sẽ được chấm điểm thủ công.
                  </p>
                </div>
              </div>
            )}

            {exercise.questions[selectedResultQuestionIndex].answerKeys!
              .length > 0 && (
              <div className="ml-11 mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h5 className="font-semibold text-blue-900 mb-2">
                  Giải thích:
                </h5>
                <p className="text-blue-800 text-sm leading-relaxed">
                  {
                    exercise.questions[selectedResultQuestionIndex]
                      .answerKeys![0].answerText
                  }
                </p>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}
