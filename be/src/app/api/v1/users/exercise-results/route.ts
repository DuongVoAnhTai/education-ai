import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const payload = verifyToken(req);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Lấy tất cả câu trả lời của user
    const userAnswers = await prisma.userAnswers.findMany({
      where: { userId: payload.userId },
      include: {
        question: {
          // Lấy thông tin câu hỏi để biết nó thuộc exercise nào
          select: {
            exerciseId: true,
            points: true,
          },
        },
      },
    });

    // 2. Nhóm các câu trả lời theo exerciseId và tính toán kết quả
    const resultsByExercise = userAnswers.reduce((acc, answer) => {
      const exerciseId = answer.question?.exerciseId;
      if (!exerciseId) return acc;

      // Khởi tạo nếu chưa có
      if (!acc[exerciseId]) {
        acc[exerciseId] = {
          exerciseId: exerciseId,
          userScore: 0,
          attemptedQuestions: 0,
        };
      }

      // Cộng điểm
      acc[exerciseId].userScore += answer.score || 0;
      acc[exerciseId].attemptedQuestions += 1;

      return acc;
    }, {} as Record<string, { exerciseId: string; userScore: number; attemptedQuestions: number }>);

    // 3. Lấy thông tin tổng điểm và điểm pass của các exercise đã làm
    const exerciseIds = Object.keys(resultsByExercise);
    const exercisesInfo = await prisma.exercises.findMany({
      where: { id: { in: exerciseIds } },
      include: {
        _count: { select: { questions: true } }, // Tổng số câu hỏi
      },
    });

    // 4. Kết hợp dữ liệu để tạo response cuối cùng
    const finalResults = exercisesInfo.map((exercise) => {
      const result = resultsByExercise[exercise.id];
      const totalPoints = exercise._count.questions; // Giả định mỗi câu 1 điểm, hoặc cần tính tổng points
      const isPassed =
        exercise.passScore != null &&
        (result.userScore / totalPoints) * 100 >= exercise.passScore;

      return {
        exerciseId: exercise.id,
        score: result.userScore,
        totalPoints: totalPoints,
        isPassed: isPassed,
      };
    });

    return NextResponse.json({ results: finalResults });
  } catch (error) {
    console.error("Get user exercise results error:", error);
    return NextResponse.json(
      { error: "Failed to get results" },
      { status: 500 }
    );
  }
}
