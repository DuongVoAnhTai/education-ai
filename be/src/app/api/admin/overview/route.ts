import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

// GET /admin/overview
export async function GET(req: Request) {
  try {
    const payload = verifyToken(req);

    if (!payload || payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [
      totalUsers,
      studentUsers,
      adminUsers,
      skills,
      exercises,
      questions,
      conversations,
      tags,
    ] = await Promise.all([
      prisma.users.count(),
      prisma.users.count({ where: { role: "STUDENT" } }),
      prisma.users.count({ where: { role: "ADMIN" } }),
      prisma.skills.count(),
      prisma.exercises.count(),
      prisma.questions.count(),
      prisma.conversations.count(),
      prisma.tags.count(),
    ]);

    return NextResponse.json({
      users: {
        total: totalUsers,
        students: studentUsers,
        admins: adminUsers,
      },
      skills,
      exercises,
      questions,
      conversations,
      tags,
    });
  } catch (error) {
    console.error("Admin overview error:", error);
    return NextResponse.json(
      { error: "Failed to get overview" },
      { status: 500 }
    );
  }
}
