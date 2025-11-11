import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const payload = verifyToken(req);

    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const exercise = await prisma.exercises.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { ordering: "asc" },
        },
      },
    });

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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = verifyToken(req);

    if (!payload || payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const {
      skillId,
      title,
      description,
      ordering,
      timeLimitSeconds,
      passScore,
    } = await req.json();

    // Lấy exercise
    const exercise = await prisma.exercises.findUnique({ where: { id } });
    if (!exercise) {
      return NextResponse.json(
        { error: "Exercise not found" },
        { status: 404 }
      );
    }

    // Update
    const updated = await prisma.exercises.update({
      where: { id },
      data: {
        skillId,
        title,
        description,
        ordering,
        timeLimitSeconds,
        passScore,
      },
      select: {
        id: true,
        skillId: true,
        title: true,
        description: true,
        ordering: true,
        timeLimitSeconds: true,
        passScore: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ skill: updated });
  } catch (error) {
    console.error("Update skill error:", error);
    return NextResponse.json(
      { error: "Failed to update skill" },
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

    // Check exercise có tồn tại không
    const existingExercise = await prisma.exercises.findUnique({
      where: { id: id },
    });

    if (!existingExercise) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 }
      );
    }
    // Xóa resource
    await prisma.exercises.delete({
      where: { id: id },
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
