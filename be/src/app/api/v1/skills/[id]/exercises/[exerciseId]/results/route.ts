import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ exerciseId: string }> }
) {
  try {
    const { exerciseId } = await params;

    const payload = await verifyToken(req);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // lấy toàn bộ câu hỏi thuộc exercise
    const questions = await prisma.questions.findMany({
      where: { exerciseId },
      select: { id: true, points: true },
    });

    const questionIds = questions.map((q) => q.id);

    // lấy toàn bộ câu trả lời của user trong exercise
    const answers = await prisma.userAnswers.findMany({
      where: {
        userId: payload.userId,
        questionId: { in: questionIds },
      },
      include: {
        question: {
          select: { prompt: true, points: true },
        },
      },
    });

    // tính toán kết quả
    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
    const score = answers.reduce((sum, ans) => sum + (ans.score ?? 0), 0);

    const correctCount = answers.filter((ans) => (ans.score ?? 0) > 0).length;
    const wrongCount = answers.length - correctCount;

    return NextResponse.json({
      exerciseId,
      totalPoints,
      score,
      correctCount,
      wrongCount,
      answers,
    });
  } catch (error) {
    console.error("Get exercise results error:", error);
    return NextResponse.json(
      { error: "Failed to get exercise results" },
      { status: 500 }
    );
  }
}
