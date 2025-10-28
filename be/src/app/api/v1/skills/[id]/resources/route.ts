import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const payload = await verifyToken(req);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resources = await prisma.learningResources.findMany({
      select: {
        id: true,
        skillId: true,
        title: true,
        resourceType: true,
        url: true,
        content: true,
        ordering: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ resources });
  } catch (error) {
    console.error("Get resources error:", error);
    return NextResponse.json(
      { error: "Failed to get resources" },
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

    const { title, resourceType, url, content, ordering } = await req.json();

    // Tạo exercise mới
    const resource = await prisma.learningResources.create({
      data: {
        skillId: id,
        title,
        resourceType,
        url,
        content,
        ordering,
      },
      select: {
        id: true,
        skillId: true,
        title: true,
        resourceType: true,
        url: true,
        content: true,
        ordering: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ resource }, { status: 201 });
  } catch (error) {
    console.error("Create resource error:", error);
    return NextResponse.json(
      { error: "Failed to create resource" },
      { status: 500 }
    );
  }
}
