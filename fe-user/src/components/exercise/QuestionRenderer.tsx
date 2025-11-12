import React from "react";

interface QuestionRendererProps {
  exercise: (Exercise & { questions: Question[] }) | null;
  userAnswers: Map<string, SubmissionAnswer>;
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (index: number) => void;
  handleAnswerSelect: (questionId: string, optionId: string) => void;
  handleTextAnswerChange: (questionId: string, text: string) => void;
}

const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  exercise,
  userAnswers,
  currentQuestionIndex,
  setCurrentQuestionIndex,
  handleAnswerSelect,
  handleTextAnswerChange,
}) => {
  if (!exercise) {
    return (
      <div className="text-center text-gray-500">
        Không thể tải được bài tập.
      </div>
    );
  }

  const question = exercise.questions[currentQuestionIndex];
  const answer = userAnswers.get(question.id);

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-8">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <div className="mb-8">
          <div className="flex items-start space-x-3 mb-4">
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center font-bold">
              {currentQuestionIndex + 1}
            </div>
            <h2 className="text-xl font-semibold text-gray-900 flex-1">
              {question.prompt}
            </h2>
          </div>
          <div className="ml-11">
            <span className="text-sm text-gray-500">
              Điểm: {question.points}
            </span>
          </div>
        </div>

        {(() => {
          switch (question.questionType) {
            case "SINGLE_CHOICE":
              const selectedOptionId = answer?.selectedOptionId;
              return (
                <div className="space-y-3">
                  {question.options &&
                    question.options.map((option) => (
                      <button
                        key={option.id}
                        onClick={() =>
                          handleAnswerSelect(question.id, option.id)
                        }
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                          selectedOptionId === option.id
                            ? "border-blue-500 bg-blue-50 shadow-md"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${
                              selectedOptionId === option.id
                                ? "border-blue-500 bg-blue-500"
                                : "border-gray-300"
                            }`}
                          >
                            {selectedOptionId === option.id && (
                              <div className="w-3 h-3 bg-white rounded-full"></div>
                            )}
                          </div>
                          <span
                            className={`text-base ${
                              selectedOptionId === option.id
                                ? "font-semibold text-gray-900"
                                : "text-gray-700"
                            }`}
                          >
                            {option.content}
                          </span>
                        </div>
                      </button>
                    ))}
                </div>
              );

            // case "MULTIPLE_CHOICE":
            //   const selectedOptionIds = new Set(
            //     answer?.selectedOptionIds || []
            //   );
            //   return (
            //     <div className="space-y-3">
            //       {question.options?.map((option) => {
            //         const isSelected = selectedOptionIds.has(option.id);
            //         return (
            //           <button
            //             key={option.id}
            //             onClick={() =>
            //               handleMultiChoiceSelect(question.id, option.id)
            //             }
            //             className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
            //               isSelected
            //                 ? "border-blue-500 bg-blue-50 shadow-md"
            //                 : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            //             }`}
            //           >
            //             <div className="flex items-center">
            //               {/* Dùng ô vuông (checkbox) thay vì ô tròn (radio) */}
            //               <div
            //                 className={`w-6 h-6 rounded-md border-2 flex items-center justify-center mr-3 flex-shrink-0 ${
            //                   isSelected
            //                     ? "border-blue-500 bg-blue-500"
            //                     : "border-gray-300"
            //                 }`}
            //               >
            //                 {isSelected && (
            //                   <Check className="w-4 h-4 text-white" />
            //                 )}
            //               </div>
            //               <span
            //                 className={`text-base ${
            //                   isSelected
            //                     ? "font-semibold text-gray-900"
            //                     : "text-gray-700"
            //                 }`}
            //               >
            //                 {option.content}
            //               </span>
            //             </div>
            //           </button>
            //         );
            //       })}
            //     </div>
            //   );
            case "SHORT_ANSWER":
            case "FILL_BLANK":
              const answerText = answer?.answerText || "";
              return (
                <div>
                  <input
                    type="text"
                    value={answerText}
                    onChange={(e) =>
                      handleTextAnswerChange(question.id, e.target.value)
                    }
                    placeholder="Nhập câu trả lời của bạn..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                  />
                </div>
              );
            case "LONG_ANSWER":
              const longAnswerText = answer?.answerText || "";
              return (
                <div>
                  <textarea
                    value={longAnswerText}
                    onChange={(e) =>
                      handleTextAnswerChange(question.id, e.target.value)
                    }
                    placeholder="Nhập câu trả lời của bạn..."
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base resize-y"
                  />
                </div>
              );

            // case "MATCHING":
            //   const stems =
            //     question.options?.filter((o) => o.matchGroup === "A") || [];
            //   const choices =
            //     question.options?.filter((o) => o.matchGroup === "B") || [];
            //   const currentPairs = answer?.matchingPairs || [];

            //   // Bạn sẽ cần một thư viện kéo-thả như `react-beautiful-dnd` hoặc `dnd-kit`
            //   // Dưới đây là ví dụ giao diện không có kéo-thả, dùng dropdown
            //   return (
            //     <div className="space-y-4">
            //       {stems.map((stem) => (
            //         <div
            //           key={stem.id}
            //           className="flex items-center justify-between p-4 border rounded-lg"
            //         >
            //           <span className="font-medium">{stem.content}</span>
            //           <select
            //             className="border-gray-300 rounded-md"
            //             value={
            //               currentPairs.find((p) => p.stemId === stem.id)
            //                 ?.optionId || ""
            //             }
            //             onChange={(e) =>
            //               handleMatchingSelect(
            //                 question.id,
            //                 stem.id,
            //                 e.target.value
            //               )
            //             }
            //           >
            //             <option value="">Chọn đáp án</option>
            //             {choices.map((choice) => (
            //               <option key={choice.id} value={choice.id}>
            //                 {choice.content}
            //               </option>
            //             ))}
            //           </select>
            //         </div>
            //       ))}
            //     </div>
            //   );
            default:
              return (
                <p className="text-gray-500">
                  Loại câu hỏi này chưa được hỗ trợ.
                </p>
              );
          }
        })()}

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-3">
            Điều hướng nhanh:
          </p>
          <div className="grid grid-cols-10 gap-2">
            {exercise.questions.map((q, index) => (
              <button
                key={q.id}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-10 h-10 rounded-lg font-semibold text-sm transition-all duration-200 cursor-pointer ${
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
  );
};

export default QuestionRenderer;
