import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";

export async function GET(req: Request) {
  try {
    const payload = verifyToken(req);
    const { searchParams } = new URL(req.url);
    const take = parseInt(searchParams.get("take") || "20");
    const cursor = searchParams.get("cursor"); // ID của skill
    const searchQuery = searchParams.get("q") || "";
    const tagFilter = searchParams.get("tag"); // Tên của tag

    const whereCondition: Prisma.SkillsWhereInput = {
      isDeleted: false,
      title: { contains: searchQuery, mode: "insensitive" },
      // Lọc theo tag nếu có
      tags: tagFilter ? { some: { tag: { name: tagFilter } } } : undefined,
    };

    if (!payload || payload.role === "STUDENT") {
      whereCondition.visibility = "PUBLIC";
    }

    const skills = await prisma.skills.findMany({
      take,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      where: whereCondition,
      orderBy: { createdAt: "desc" },
      include: {
        tags: {
          // Từ SkillTags, lấy tiếp thông tin của Tag liên quan
          include: {
            tag: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },

        owner: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
          },
        },
      },
    });

    let nextCursor: string | null = null;
    if (skills.length === take) {
      nextCursor = skills[skills.length - 1].id;
    }

    const formattedSkills = skills.map((skill) => ({
      ...skill,
      // Thay thế mảng 'tags' phức tạp bằng một mảng tag đơn giản
      tags: skill.tags.map((skillTag) => skillTag.tag),
    }));

    return NextResponse.json({ skills: formattedSkills, nextCursor });
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
