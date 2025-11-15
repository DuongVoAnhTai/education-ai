import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// POST: thêm option cho câu hỏi
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const payload = await verifyToken(req);
    if (!payload || payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content, isCorrect, ordering } = await req.json();

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const option = await prisma.questionOptions.create({
      data: {
        questionId: id,
        content,
        isCorrect: isCorrect ?? false,
        ordering,
      },
    });

    return NextResponse.json({ option }, { status: 201 });
  } catch (error) {
    console.error("Create option error:", error);
    return NextResponse.json(
      { error: "Failed to create option" },
      { status: 500 }
    );
  }
}
