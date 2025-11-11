import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { MatchType } from "@/generated/prisma";

export async function POST(
  req: Request,
  { params }: { params: { exerciseId: string } }
) {
  try {
    const { exerciseId } = await params;
    const payload = verifyToken(req);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const submittedAnswers: UserSubmissionAnswer[] = await req.json();
    if (!Array.isArray(submittedAnswers) || submittedAnswers.length === 0) {
      return NextResponse.json(
        { error: "No answers provided" },
        { status: 400 }
      );
    }

    // Mọi thao tác đều nằm trong đây để đảm bảo tính toàn vẹn dữ liệu
    const submissionResult = await prisma.$transaction(async (tx) => {
      // 1. Lấy thông tin bài tập và tất cả câu hỏi + đáp án đúng
      const exercise = await tx.exercises.findUnique({
        where: { id: exerciseId },
        include: {
          questions: {
            include: {
              options: true, // Lấy các lựa chọn cho câu trắc nghiệm
              answerKeys: true, // Lấy đáp án cho câu tự luận ngắn
            },
          },
        },
      });

      if (!exercise) {
        throw new Error("Exercise not found"); // Lỗi này sẽ làm transaction rollback
      }

      let totalScore = 0;
      const answerProcessingPromises = [];

      // 2. Lặp qua từng câu trả lời của người dùng để chấm điểm
      for (const userAnswer of submittedAnswers) {
        const question = exercise.questions.find(
          (q) => q.id === userAnswer.questionId
        );
        if (!question) continue; // Bỏ qua nếu câu hỏi không thuộc bài tập này

        let score = 0;

        // --- LOGIC CHẤM ĐIỂM ---
        if (
          question.questionType === "SINGLE_CHOICE" &&
          userAnswer.selectedOptionId
        ) {
          const selectedOption = question.options.find(
            (o) => o.id === userAnswer.selectedOptionId
          );
          if (selectedOption?.isCorrect) {
            score = question.points;
          }
        } else if (
          (question.questionType === "SHORT_ANSWER" ||
            question.questionType === "FILL_BLANK") &&
          userAnswer.answerText
        ) {
          for (const key of question.answerKeys) {
            if (
              checkMatch(userAnswer.answerText, key.answerText, key.matchType)
            ) {
              score = question.points;
              break; // Dừng lại khi tìm thấy một đáp án đúng
            }
          }
        }
        // (Thêm logic cho MULTIPLE_CHOICE, LONG_ANSWER... nếu cần)

        totalScore += score;

        // 3. Chuẩn bị để lưu câu trả lời vào CSDL
        answerProcessingPromises.push(
          tx.userAnswers.upsert({
            where: {
              userId_questionId: {
                userId: payload.userId,
                questionId: question.id,
              },
            },
            update: {
              selectedOptionId: userAnswer.selectedOptionId,
              answerText: userAnswer.answerText,
              score: score,
              submittedAt: new Date(),
            },
            create: {
              userId: payload.userId,
              questionId: question.id,
              selectedOptionId: userAnswer.selectedOptionId,
              answerText: userAnswer.answerText,
              score: score,
            },
          })
        );
      }

      // 4. Thực thi tất cả các thao tác lưu câu trả lời
      await Promise.all(answerProcessingPromises);

      // 5. Cập nhật tiến độ của người dùng với kỹ năng (nếu có)
      if (exercise.skillId) {
        await tx.userSkillProgress.upsert({
          where: {
            userId_skillId: {
              userId: payload.userId,
              skillId: exercise.skillId,
            },
          },
          update: {
            // Cập nhật các trường cần thiết, ví dụ: tăng completedExercises
          },
          create: {
            userId: payload.userId,
            skillId: exercise.skillId,
            completedExercises: 1, // Ví dụ
            totalExercises: await tx.exercises.count({
              where: { skillId: exercise.skillId },
            }),
          },
        });
      }

      const totalPoints = exercise.questions.reduce(
        (sum, q) => sum + q.points,
        0
      );

      return {
        totalScore,
        totalPoints,
        isPassed:
          exercise.passScore != null ? totalScore >= exercise.passScore : null,
      };
    });
    // --- KẾT THÚC TRANSACTION ---

    return NextResponse.json(
      { message: "Bài làm đã được nộp thành công!", result: submissionResult },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Submit exercise error:", error);
    if (error.message === "Exercise not found") {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to submit exercise" },
      { status: 500 }
    );
  }
}

function checkMatch(
  input: string,
  expected: string,
  matchType: MatchType
): boolean {
  switch (matchType) {
    case "EXACT":
      return input.trim() === expected.trim();
    case "CASE_INSENSITIVE":
      return input.trim().toLowerCase() === expected.trim().toLowerCase();
    case "CONTAINS":
      return input.trim().toLowerCase().includes(expected.trim().toLowerCase());
    case "REGEX":
      try {
        return new RegExp(expected).test(input);
      } catch (e) {
        return false;
      }
    default:
      return false;
  }
}
