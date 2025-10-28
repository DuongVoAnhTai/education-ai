import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const payload = await verifyToken(req);
    if (!payload || payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { skillId, title, resourceType, url, content, ordering } =
      await req.json();

    // Check resource có tồn tại không
    const existingResource = await prisma.learningResources.findUnique({
      where: { id: id },
    });

    if (!existingResource) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 }
      );
    }

    // Cập nhật resource
    const updated = await prisma.learningResources.update({
      where: { id: id },
      data: {
        skillId,
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
        updatedAt: true,
      },
    });

    return NextResponse.json({ resource: updated });
  } catch (error) {
    console.error("Update resource error:", error);
    return NextResponse.json(
      { error: "Failed to update resource" },
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

    // Check resource có tồn tại không
    const existingResource = await prisma.learningResources.findUnique({
      where: { id: id },
    });

    if (!existingResource) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 }
      );
    }
    // Xóa resource
    await prisma.learningResources.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: "Resource deleted successfully" });
  } catch (error) {
    console.error("Delete resource error:", error);
    return NextResponse.json(
      { error: "Failed to delete resource" },
      { status: 500 }
    );
  }
}
