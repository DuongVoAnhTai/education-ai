import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string; exerciseId: string }> }
) {
  try {
    const { id, exerciseId } = await params;
    const payload = verifyToken(req);

    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const exercise = await prisma.exercises.findUnique({
      where: { id: exerciseId, skillId: id },
      include: {
        questions: {
          orderBy: { ordering: "asc" },

          include: {
            options: {
              select: { id: true, content: true, ordering: true },
              orderBy: { ordering: "asc" },
            },
          },
        },
      },
    });

    if (!exercise) {
      return NextResponse.json(
        { error: "Exercise not found in this skill" },
        { status: 404 }
      );
    }

    return NextResponse.json({ exercise });
  } catch (error) {
    console.error("Get exercise error:", error);
    return NextResponse.json(
      { error: "Failed to get exercise" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string; exerciseId: string }> }
) {
  try {
    const payload = verifyToken(req);

    if (!payload || payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, exerciseId } = await params;

    const { title, description, ordering, timeLimitSeconds, passScore } =
      await req.json();

    // Lấy exercise
    const exercise = await prisma.exercises.findUnique({
      where: { id: exerciseId, skillId: id },
    });
    if (!exercise) {
      return NextResponse.json(
        { error: "Exercise not found" },
        { status: 404 }
      );
    }

    // Update
    const updated = await prisma.exercises.update({
      where: { id: exerciseId, skillId: id },
      data: {
        title,
        description,
        ordering,
        timeLimitSeconds,
        passScore,
      },
    });

    return NextResponse.json({ exercise: updated });
  } catch (error) {
    console.error("Update exercise error:", error);
    return NextResponse.json(
      { error: "Failed to update exercise" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string; exerciseId: string }> }
) {
  try {
    const { id, exerciseId } = await params;

    const payload = await verifyToken(req);
    if (!payload || payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check exercise có tồn tại không
    const existingExercise = await prisma.exercises.findUnique({
      where: { id: exerciseId, skillId: id },
    });

    if (!existingExercise) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 }
      );
    }
    // Xóa resource
    await prisma.exercises.delete({
      where: { id: exerciseId, skillId: id },
    });

    return NextResponse.json({ message: "Exercise deleted successfully" });
  } catch (error) {
    console.error("Delete exercise error:", error);
    return NextResponse.json(
      { error: "Failed to delete exercises" },
      { status: 500 }
    );
  }
}
