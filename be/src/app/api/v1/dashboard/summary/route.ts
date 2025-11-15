// src/app/api/v1/dashboard/summary/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const payload = await verifyToken(req);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // --- SỬ DỤNG Promise.all ĐỂ FETCH SONG SONG CÁC DỮ LIỆU CẦN THIẾT ---
    const [
      // 1. Lấy dữ liệu tiến độ cho phần "Learning Progress"
      skillsInProgress,
      // 2. Lấy dữ liệu nộp bài cho "Recent Results" và tính toán các chỉ số
      allUserSubmissions,
      // 3. Đếm tổng số bài tập có sẵn
      totalExercisesCount,
    ] = await Promise.all([
      prisma.userSkillProgress.findMany({
        where: { userId: payload.userId },
        orderBy: { skill: { updatedAt: "desc" } }, // Sắp xếp theo tương tác gần nhất của skill
        take: 5,
        include: {
          skill: {
            select: {
              id: true,
              title: true,
              description: true,
            },
          },
        },
      }),
      prisma.userSubmissions.findMany({
        where: { userId: payload.userId },
        orderBy: { submittedAt: "desc" },
        include: {
          exercise: {
            select: {
              title: true,
              skill: { select: { title: true } },
            },
          },
        },
      }),
      prisma.exercises.count({
        where: { skill: { visibility: "PUBLIC" } }, // Chỉ đếm các bài tập công khai
      }),
    ]);

    // --- XỬ LÝ VÀ TÍNH TOÁN CÁC CHỈ SỐ TỪ DỮ LIỆU ĐÃ FETCH ---

    // A. Dữ liệu cho các Card Tóm tắt (Summary Cards)
    const skillsInProgressCount =
      skillsInProgress.length > 0
        ? await prisma.userSkillProgress.count({
            where: { userId: payload.userId },
          })
        : 0;

    const totalCompletedCount = allUserSubmissions.filter(
      (s) => s.isPassed
    ).length;

    const totalUserScore = allUserSubmissions.reduce(
      (sum, s) => sum + s.score,
      0
    );
    const totalMaxScore = allUserSubmissions.reduce(
      (sum, s) => sum + s.totalPoints,
      0
    );
    const averageScore =
      totalMaxScore > 0 ? (totalUserScore / totalMaxScore) * 10 : 0;

    // B. Dữ liệu cho phần "Tiến độ học tập" (Learning Progress)
    const learningProgress = skillsInProgress.map((p) => ({
      id: p.skill.id,
      title: p.skill.title,
      description: p.skill.description,
      progress: p.progress,
      completedExercises: p.completedExercises,
      exerciseCount: p.totalExercises,
    }));

    // C. Dữ liệu cho phần "Kết quả gần đây" (Recent Results)
    const recentResults = allUserSubmissions.slice(0, 5).map((s) => ({
      exerciseId: s.exerciseId,
      exerciseTitle: s.exercise.title,
      skillTitle: s.exercise.skill?.title || "N/A",
      score: s.score,
      totalPoints: s.totalPoints,
      submittedAt: s.submittedAt,
    }));

    // --- TRẢ VỀ RESPONSE HOÀN CHỈNH ---
    return NextResponse.json({
      summary: {
        skillsInProgressCount,
        totalCompletedCount,
        totalExercises: totalExercisesCount,
        averageScore: averageScore,
      },
      learningProgress,
      recentResults,
    });
  } catch (error) {
    console.error("Get dashboard summary error:", error);
    return NextResponse.json(
      { error: "Failed to get dashboard data" },
      { status: 500 }
    );
  }
}
