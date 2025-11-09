import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkVisibility } from "@/lib/checkVisibility";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
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

    return NextResponse.json({ resources: skill.resources });
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

    // Kiểm tra skill có tồn tại không
    const skillExists = await prisma.skills.findUnique({
      where: { id },
    });
    if (!skillExists) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
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
