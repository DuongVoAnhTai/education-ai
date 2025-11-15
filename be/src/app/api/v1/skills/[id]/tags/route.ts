import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { checkVisibility } from "@/lib/checkVisibility";

// GET /skills/:skillId/tags — lấy tags của skill
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const visibilityResult = await checkVisibility(req, id);
    if (visibilityResult instanceof NextResponse) {
      return visibilityResult;
    }

    const skillTags = await prisma.skillTags.findMany({
      where: { skillId: id },
      include: { tag: true },
    });

    return NextResponse.json({
      tags: skillTags.map((st) => st.tag),
    });
  } catch (error) {
    console.error("Get skill tags error:", error);
    return NextResponse.json({ error: "Failed to get tags" }, { status: 500 });
  }
}

// POST /skills/:skillId/tags — gắn tag cho skill
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const payload = await verifyToken(req);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { tagName } = await req.json();
    if (!tagName) {
      return NextResponse.json(
        { error: "tagName is required" },
        { status: 400 }
      );
    }

    const tag = await prisma.$transaction(async (tx) => {
      const tag = await tx.tags.upsert({
        where: { name: tagName },
        update: {},
        create: { name: tagName },
      });

      await tx.skillTags.create({
        data: { skillId: id, tagId: tag.id },
      });

      return tag;
    });

    return NextResponse.json({ message: "Tag added", tag });
  } catch (error: any) {
    if (error.code === "P2002") {
      // duplicate key (skillId + tagId)
      return NextResponse.json(
        { error: "Tag already attached" },
        { status: 400 }
      );
    }
    console.error("Add tag to skill error:", error);
    return NextResponse.json({ error: "Failed to add tag" }, { status: 500 });
  }
}
