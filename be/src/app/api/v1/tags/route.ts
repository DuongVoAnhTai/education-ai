import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// GET /tags — lấy danh sách tags
export async function GET(req: NextRequest) {
  try {
    // const { searchParams } = new URL(req.url);
    // const query = searchParams.get("q") || "";

    const query = req.nextUrl.searchParams.get("q") || "";

    console.log("API received search query:", query);

    const tags = await prisma.tags.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      take: 10,
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ tags });
  } catch (error) {
    console.error("Get tags error:", error);
    return NextResponse.json({ error: "Failed to get tags" }, { status: 500 });
  }
}

// POST /tags — tạo tag (chỉ ADMIN/TEACHER)
export async function POST(req: Request) {
  try {
    const payload = await verifyToken(req);
    if (!payload || payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name } = await req.json();
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const tag = await prisma.tags.create({
      data: { name },
    });

    return NextResponse.json({ tag }, { status: 201 });
  } catch (error) {
    console.error("Create tag error:", error);
    return NextResponse.json(
      { error: "Failed to create tag" },
      { status: 500 }
    );
  }
}
