import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const payload = verifyToken(req);

    let skills;

    if (!payload) {
      // Nếu chưa đăng nhập → chỉ trả PUBLIC
      skills = await prisma.skills.findMany({
        where: { isDeleted: false, visibility: "PUBLIC" },
        orderBy: { createdAt: "desc" },
      });
    } else if (payload.role === "ADMIN") {
      // Admin → thấy tất cả
      skills = await prisma.skills.findMany({
        // where: { isDeleted: false },
        orderBy: { createdAt: "desc" },
      });
    } else if (payload.role === "STUDENT") {
      // Student → chỉ thấy PUBLIC
      skills = await prisma.skills.findMany({
        where: { isDeleted: false, visibility: "PUBLIC" },
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json({ skills });
  } catch (error) {
    console.error("Get skills error:", error);
    return NextResponse.json(
      { error: "Failed to get skills" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const payload = verifyToken(req);

    if (!payload || payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { ownerId, title, description, visibility } = await req.json();

    // Validate input
    if (!ownerId || !title) {
      return NextResponse.json(
        { error: "ownerId and title are required" },
        { status: 400 }
      );
    }

    // Check owner có tồn tại không
    const owner = await prisma.users.findUnique({ where: { id: ownerId } });
    if (!owner) {
      return NextResponse.json({ error: "Owner not found" }, { status: 404 });
    }

    // Tạo skill mới
    const skill = await prisma.skills.create({
      data: {
        ownerId,
        title,
        description,
        visibility: visibility || "PRIVATE", // default PRIVATE
      },
      select: {
        id: true,
        ownerId: true,
        title: true,
        description: true,
        visibility: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ skill }, { status: 201 });
  } catch (error) {
    console.error("Create skill error:", error);
    return NextResponse.json(
      { error: "Failed to create skill" },
      { status: 500 }
    );
  }
}
