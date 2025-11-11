import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const payload = await verifyToken(req);
    if (!payload || payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { questionType, prompt, points, ordering } =
      await req.json();

    // Check question có tồn tại không
    const existingQuestion = await prisma.questions.findUnique({
      where: { id },
    });

    if (!existingQuestion) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    // Cập nhật question
    const updated = await prisma.questions.update({
      where: { id },
      data: {
        questionType,
        prompt,
        points,
        ordering,
      },
    });

    return NextResponse.json({ question: updated });
  } catch (error) {
    console.error("Update question error:", error);
    return NextResponse.json(
      { error: "Failed to update question" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const payload = await verifyToken(req);
    if (!payload || payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check resource có tồn tại không
    const existingResource = await prisma.questions.findUnique({
      where: { id: id },
    });

    if (!existingResource) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 }
      );
    }
    // Xóa resource
    await prisma.questions.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: "Question deleted successfully" });
  } catch (error) {
    console.error("Delete question error:", error);
    return NextResponse.json(
      { error: "Failed to delete question" },
      { status: 500 }
    );
  }
}
