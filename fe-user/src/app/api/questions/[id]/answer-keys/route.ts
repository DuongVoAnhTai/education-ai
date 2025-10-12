import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST: thêm answer key cho câu hỏi
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    const payload = verifyToken(req);
    if (!payload || payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { answerText, matchType } = await req.json();

    if (!answerText || !matchType) {
      return NextResponse.json(
        { error: "Answer text and match type are required" },
        { status: 400 }
      );
    }

    const key = await prisma.questionAnswerKeys.create({
      data: {
        questionId: id,
        answerText,
        matchType,
      },
    });

    return NextResponse.json({ key }, { status: 201 });
  } catch (error) {
    console.error("Create answer key error:", error);
    return NextResponse.json(
      { error: "Failed to create answer key" },
      { status: 500 }
    );
  }
}
