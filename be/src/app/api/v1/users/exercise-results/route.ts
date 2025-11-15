import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const payload = await verifyToken(req);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Lấy tất cả câu trả lời của user
    const submissions = await prisma.userSubmissions.findMany({
      where: { userId: payload.userId },
      orderBy: { submittedAt: "desc" },
      include: {
        exercise: {
          // Include thông tin của bài tập liên quan
          select: {
            title: true,
            skill: {
              // Include cả thông tin của kỹ năng cha
              select: {
                title: true,
              },
            },
          },
        },
      },
    });

    const finalResults = submissions.map((submission) => {
      return {
        exerciseId: submission.exerciseId,
        exerciseTitle: submission.exercise.title,
        skillTitle: submission.exercise.skill?.title || "undefined",
        score: submission.score,
        totalPoints: submission.totalPoints,
        isPassed: submission.isPassed,
        timeSpentSeconds: submission.timeSpentSeconds,
        submittedAt: submission.submittedAt,
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
