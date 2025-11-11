import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkVisibility } from "@/lib/checkVisibility";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const payload = await verifyToken(req);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const visibilityResult = await checkVisibility(req, id);
    if (visibilityResult instanceof NextResponse) {
      return visibilityResult;
    }

    const { skill } = visibilityResult;

    return NextResponse.json({ exercises: skill.exercises });
  } catch (error) {
    console.error("Get exercises error:", error);
    return NextResponse.json(
      { error: "Failed to get exercises" },
      { status: 500 }
    );
  }
}

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

    const { title, description, ordering, timeLimitSeconds, passScore } =
      await req.json();

    // Validate required fields
    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // Tạo exercise mới
    const exercise = await prisma.exercises.create({
      data: {
        skillId: id,
        title,
        description,
        ordering,
        timeLimitSeconds,
        passScore,
      },
    });

    return NextResponse.json({ exercise }, { status: 201 });
  } catch (error) {
    console.error("Create exercises error:", error);
    return NextResponse.json(
      { error: "Failed to create exercises" },
      { status: 500 }
    );
  }
}
