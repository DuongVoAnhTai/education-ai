import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { exerciseId: string } }
) {
  try {
    const { exerciseId } = await params;
    const payload = await verifyToken(req);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const questions = await prisma.questions.findMany({
      where: { exerciseId },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Get questions error:", error);
    return NextResponse.json(
      { error: "Failed to get questions" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ exerciseId: string }> }
) {
  try {
    const { exerciseId } = await params;

    const payload = await verifyToken(req);
    if (!payload || payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { questionType, prompt, points, ordering } = await req.json();

    // Validate required fields
    if (!questionType || !prompt) {
      return NextResponse.json(
        { error: "Question Type, prompt are required" },
        { status: 400 }
      );
    }

    // Tạo exercise mới
    const question = await prisma.questions.create({
      data: {
        exerciseId,
        questionType,
        prompt,
        points,
        ordering,
      },
    });

    return NextResponse.json({ question }, { status: 201 });
  } catch (error) {
    console.error("Create question error:", error);
    return NextResponse.json(
      { error: "Failed to create question" },
      { status: 500 }
    );
  }
}
