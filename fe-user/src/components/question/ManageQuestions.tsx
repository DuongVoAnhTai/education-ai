"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import {
  Loader2,
  PlusCircle,
  Edit,
  Trash2,
  ArrowLeft,
  AlertCircle,
  ListChecks,
} from "lucide-react";

import QuestionFormModal from "@/components/question/QuestionFormModal";
import OptionRow from "@/components/question/OptionQuestion"; // Import OptionRow
import * as exerciseService from "@/services/exerciseServices";
import * as questionService from "@/services/questionServices";

function ManageQuestions() {
  const params = useParams();
  const router = useRouter();
  const exerciseId = params.exercisesId as string;
  const skillId = params.id as string;

  const [exercise, setExercise] = useState<
    (Exercise & { questions: Question[] }) | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchExercise = async () => {
    setLoading(true);
    const response = await exerciseService.getExerciseById(skillId, exerciseId);
    if ("exercise" in response) {
      setExercise(response.exercise);
    } else {
      setError(response.error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!skillId) {
      router.push("/teacher/skills"); // Nếu không có ID, quay về trang danh sách
      return;
    }

    fetchExercise();
  }, [skillId, router]);

  // --- LOGIC CRUD CHO QUESTIONS ---
  const handleSaveQuestion = async (data: any) => {
    setIsSaving(true);
    let response;
    if (editingQuestion) {
      response = await questionService.updateQuestion(editingQuestion.id, data);
    } else {
      response = await questionService.createQuestion(
        skillId,
        exerciseId,
        data
      );
    }

    if (response.error) {
      toast.error(response.error);
    } else {
      toast.success(
        editingQuestion ? "Cập nhật thành công!" : "Tạo mới thành công!"
      );
      setIsModalOpen(false);
      setExercise((prevExercise) => {
        if (!prevExercise) return null;
        if (editingQuestion) {
          // Update existing question
          return {
            ...prevExercise,
            questions: prevExercise.questions.map((q) =>
              q.id === editingQuestion.id ? { ...q, ...data } : q
            ),
          };
        } else {
          // Add new question
          return {
            ...prevExercise,
            questions: [...prevExercise.questions, response.question], // Assuming response contains the new question
          };
        }
      });
    }
    setIsSaving(false);
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa câu hỏi này?")) return;
    const response = await questionService.deleteQuestion(questionId);
    if (response.error) {
      toast.error(response.error);
    } else {
      toast.success("Xóa câu hỏi thành công!");
      setExercise((prevExercise) => {
        if (!prevExercise) return null;
        return {
          ...prevExercise,
          questions: prevExercise.questions.filter((q) => q.id !== questionId),
        };
      });
    }
  };

  const handleSaveOption = async (
    questionId: string,
    optionId: string | null,
    data: { content: string; isCorrect: boolean }
  ) => {
    setIsSaving(true);
    let response;
    if (optionId) {
      response = await questionService.updateOption(questionId, optionId, data);
    } else {
      response = await questionService.createOptionForQuestion(
        questionId,
        data
      );
    }

    if (response.error) {
      toast.error(response.error);
    } else {
      toast.success(
        optionId ? "Cập nhật tùy chọn thành công!" : "Tạo tùy chọn thành công!"
      );
      setExercise((prevExercise) => {
        if (!prevExercise) return null;
        const updatedQuestions = prevExercise.questions.map((q) => {
          if (q.id === questionId) {
            if (optionId) {
              // Update existing option
              return {
                ...q,
                options: q.options?.map((opt) =>
                  opt.id === optionId ? { ...opt, ...data } : opt
                ),
              };
            } else {
              // Add new option
              return {
                ...q,
                options: [...(q.options || []), response.option], // Assuming response contains the new option
              };
            }
          }
          return q;
        });
        return { ...prevExercise, questions: updatedQuestions };
      });
    }
    setIsSaving(false);
  };

  const handleDeleteOption = async (questionId: string, optionId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa tùy chọn này?")) return;
    const response = await questionService.deleteOption(questionId, optionId);
    if (response.error) {
      toast.error(response.error);
    } else {
      toast.success("Xóa tùy chọn thành công!");
      setExercise((prevExercise) => {
        if (!prevExercise) return null;
        const updatedQuestions = prevExercise.questions.map((q) => {
          if (q.id === questionId) {
            return {
              ...q,
              options: q.options?.filter((opt) => opt.id !== optionId),
            };
          }
          return q;
        });
        return { ...prevExercise, questions: updatedQuestions };
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-red-50 border border-red-200 rounded-lg">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-xl font-semibold text-red-700">Đã xảy ra lỗi</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-10xl mx-auto">
      <Link
        href={`/skills/${exercise?.skillId}/exercises`}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-4"
      >
        <ArrowLeft size={16} /> Quay lại danh sách bài tập
      </Link>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{exercise?.title}</h1>
          <p className="text-gray-500">Quản lý câu hỏi</p>
        </div>
        <button
          onClick={() => {
            setEditingQuestion(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 cursor-pointer"
        >
          <PlusCircle size={20} /> Tạo câu hỏi
        </button>
      </div>

      <div className="space-y-4">
        {exercise?.questions?.map((question, index) => (
          <div
            key={question.id}
            className="bg-white p-4 rounded-lg border flex justify-between items-start"
          >
            <div className="flex items-start gap-4">
              <span className="font-bold text-lg text-blue-600">
                {index + 1}.
              </span>
              <div>
                <p className="font-semibold">{question.prompt}</p>
                <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                  {question.questionType}
                </span>
                {(question.questionType === "SINGLE_CHOICE" ||
                  question.questionType === "MULTIPLE_CHOICE") && (
                  <div className="mt-2 space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">
                      Tùy chọn:
                    </h4>
                    {question.options?.map((option) => (
                      <OptionRow
                        key={option.id}
                        option={option}
                        onUpdate={(optionId, data) =>
                          handleSaveOption(question.id, optionId, data)
                        }
                        onDelete={(optionId) =>
                          handleDeleteOption(question.id, optionId)
                        }
                      />
                    ))}
                    <button
                      onClick={() =>
                        handleSaveOption(question.id, null, {
                          content: "Tùy chọn mới",
                          isCorrect: false,
                        })
                      }
                      className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
                    >
                      <PlusCircle size={16} /> Thêm tùy chọn
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/teacher/skills/${skillId}/exercises/${exerciseId}/manage`}
              >
                <button
                  className="p-2 hover:text-green-600 cursor-pointer"
                  title="Quản lý đáp án"
                >
                  <ListChecks size={16} />
                </button>
              </Link>
              <button
                onClick={() => {
                  setEditingQuestion(question);
                  setIsModalOpen(true);
                }}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-md cursor-pointer"
                title="Sửa"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => handleDeleteQuestion(question.id)}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md cursor-pointer"
                title="Xóa"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <QuestionFormModal
          initialData={editingQuestion}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveQuestion}
          isSaving={isSaving}
        />
      )}
    </div>
  );
}

export default ManageQuestions;
