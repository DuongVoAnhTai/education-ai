import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PUT: cập nhật answer key
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string; keyId: string }> }
) {
  try {
    const { id, keyId } = await params;

    const payload = verifyToken(req);
    if (!payload || payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { answerText, matchType } = await req.json();

    const updated = await prisma.questionAnswerKeys.update({
      where: { id: keyId, questionId: id },
      data: { answerText, matchType },
    });

    return NextResponse.json({ key: updated });
  } catch (error) {
    console.error("Update answer key error:", error);
    return NextResponse.json(
      { error: "Failed to update answer key" },
      { status: 500 }
    );
  }
}

// DELETE: xóa answer key
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string; keyId: string }> }
) {
  try {
    const { id, keyId } = await params;

    const payload = verifyToken(req);
    if (!payload || payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.questionAnswerKeys.delete({
      where: { id: keyId, questionId: id },
    });

    return NextResponse.json({ message: "Answer key deleted" });
  } catch (error) {
    console.error("Delete answer key error:", error);
    return NextResponse.json(
      { error: "Failed to delete answer key" },
      { status: 500 }
    );
  }
}
