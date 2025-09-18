import { NextResponse } from "next/server";
import { checkVisibility } from "@/lib/checkVisibility";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const visibilityResult = await checkVisibility(req, params.id);
  if (visibilityResult instanceof NextResponse) {
    return visibilityResult; // Trả về response lỗi (401/403/404)
  }

  // visibilityResult là object { allowed: true, skill }
  const { skill } = visibilityResult;

  // Chỉ chọn và trả các trường cần thiết (tránh lộ thêm dữ liệu nếu có)
  const responsePayload = {
    id: skill.id,
    title: skill.title,
    description: skill.description,
    visibility: skill.visibility,
    ownerId: skill.ownerId,
    createdAt: skill.createdAt,
    resources: skill.resources,
  };

  return NextResponse.json(responsePayload);
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const payload = verifyToken(req);

    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const { title, description, visibility, isDeleted } = await req.json();

    // Lấy skill
    const skill = await prisma.skills.findUnique({ where: { id } });
    if (!skill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    // Quyền sửa:
    // - Admin có thể sửa tất cả
    // - Owner có thể sửa skill của mình
    if (payload.role !== "ADMIN" && payload.userId !== skill.ownerId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Update
    const updated = await prisma.skills.update({
      where: { id },
      data: {
        title,
        description,
        visibility,
        isDeleted,
      },
      select: {
        id: true,
        title: true,
        description: true,
        visibility: true,
        ownerId: true,
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
  { params }: { params: { id: string } }
) {
  try {
    const payload = verifyToken(req);

    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    const skill = await prisma.skills.findUnique({ where: { id } });
    if (!skill || skill.isDeleted) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    // Quyền xóa:
    // - Admin xóa được tất cả
    // - Owner xóa được skill của mình
    if (payload.role !== "ADMIN" && payload.userId !== skill.ownerId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Soft delete
    const deleted = await prisma.skills.update({
      where: { id },
      data: { isDeleted: true },
      select: { id: true, title: true, isDeleted: true },
    });

    return NextResponse.json({ message: "Skill deleted", skill: deleted });
  } catch (error) {
    console.error("Delete skill error:", error);
    return NextResponse.json(
      { error: "Failed to delete skill" },
      { status: 500 }
    );
  }
}
