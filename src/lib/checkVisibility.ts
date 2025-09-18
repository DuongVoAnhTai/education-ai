import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function checkVisibility(req: Request, skillId: string) {
  // Lấy thông tin skill
  const skill = await prisma.skills.findUnique({
    where: { id: skillId },
    include: {
      resources: {
        orderBy: { ordering: "asc" },
      },
    },
  });

  if (!skill || skill.isDeleted) {
    return NextResponse.json({ error: "Skill not found" }, { status: 404 });
  }

  // 1. Nếu PUBLIC → ai cũng xem được
  if (skill.visibility === "PUBLIC") {
    return { allowed: true, skill };
  }

  // 2. Nếu PRIVATE → chỉ admin
  if (skill.visibility === "PRIVATE") {
    const payload = verifyToken(req);
    if (!payload || payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return { allowed: true, skill };
  }

  // 3. Nếu UNLISTED → ai có link (skillId) đều xem được
  if (skill.visibility === "UNLISTED") {
    // chỉ cần có đúng ID thì cho xem, không cần login
    return { allowed: true, skill };
  }

  return NextResponse.json({ error: "Access denied" }, { status: 403 });
}
