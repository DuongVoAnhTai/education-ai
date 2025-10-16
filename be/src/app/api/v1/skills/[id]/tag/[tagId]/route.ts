import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string; tagId: string } }
) {
  const { id, tagId } = params;

  try {
    const payload = verifyToken(req);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.skillTags.delete({
      where: {
        skillId_tagId: { skillId: id, tagId },
      },
    });

    return NextResponse.json({ message: "Tag removed" });
  } catch (error) {
    console.error("Remove tag error:", error);
    return NextResponse.json({ error: "Failed to remove tag" }, { status: 500 });
  }
}
