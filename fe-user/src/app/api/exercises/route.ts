import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const payload = await verifyToken(req);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const exercises = await prisma.exercises.findMany({
      select: {
        id: true,
        skillId: true,
        title: true,
        description: true,
        ordering: true,
        timeLimitSeconds: true,
        passScore: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ exercises });
  } catch (error) {
    console.error("Get exercises error:", error);
    return NextResponse.json(
      { error: "Failed to get exercises" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const payload = await verifyToken(req);
    if (!payload || payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      skillId,
      title,
      description,
      ordering,
      timeLimitSeconds,
      passScore,
    } = await req.json();

    // Validate required fields
    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // Tạo exercise mới
    const exercise = await prisma.exercises.create({
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
        createdAt: true,
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
