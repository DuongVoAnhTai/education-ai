import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const payload = verifyToken(req);

    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const answers = await prisma.userAnswers.findMany({
      where: { userId: payload.userId },
      orderBy: { submittedAt: "desc" },
      include: {
        question: {
          select: {
            id: true,
            prompt: true,
            questionType: true,
            points: true,
            exerciseId: true,
          },
        },
        option: {
          select: {
            id: true,
            content: true,
            isCorrect: true,
          },
        },
      },
    });

    return NextResponse.json({ answers });
  } catch (error) {
    console.error("Get my answers error:", error);
    return NextResponse.json(
      { error: "Failed to get answers history" },
      { status: 500 }
    );
  }
}
