import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PUT: cập nhật option
export async function PUT(
  req: Request,
  { params }: { params: { id: string; optionId: string } }
) {
  try {
    const { id, optionId } = await params;

    const payload = verifyToken(req);
    if (!payload || payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content, isCorrect, ordering } = await req.json();

    const updated = await prisma.questionOptions.update({
      where: { id: optionId },
      data: { content, isCorrect, ordering },
    });

    return NextResponse.json({ option: updated });
  } catch (error) {
    console.error("Update option error:", error);
    return NextResponse.json(
      { error: "Failed to update option" },
      { status: 500 }
    );
  }
}

// DELETE: xóa option
export async function DELETE(
  req: Request,
  { params }: { params: { id: string; optionId: string } }
) {
  try {
    const { id, optionId } = await params;

    const payload = verifyToken(req);
    if (!payload || payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.questionOptions.delete({
      where: { id: optionId },
    });

    return NextResponse.json({ message: "Option deleted" });
  } catch (error) {
    console.error("Delete option error:", error);
    return NextResponse.json(
      { error: "Failed to delete option" },
      { status: 500 }
    );
  }
}
