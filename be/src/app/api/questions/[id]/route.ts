import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    const payload = await verifyToken(req);
    if (!payload || payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { exerciseId, questionType, prompt, points, ordering } =
      await req.json();

    // Check question có tồn tại không
    const existingQuestion = await prisma.questions.findUnique({
      where: { id: id },
    });

    if (!existingQuestion) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    // Cập nhật question
    const updated = await prisma.questions.update({
      where: { id: id },
      data: {
        exerciseId,
        questionType,
        prompt,
        points,
        ordering,
      },
      select: {
        id: true,
        exerciseId: true,
        questionType: true,
        prompt: true,
        points: true,
        ordering: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ question: updated });
  } catch (error) {
    console.error("Update question error:", error);
    return NextResponse.json(
      { error: "Failed to update question" },
      { status: 500 }
    );
  }
}

// export async function DELETE(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const { id } = await params;

//     const payload = await verifyToken(req);
//     if (!payload || payload.role !== "ADMIN") {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     // Check resource có tồn tại không
//     const existingResource = await prisma.learningResources.findUnique({
//       where: { id: id },
//     });

//     if (!existingResource) {
//       return NextResponse.json(
//         { error: "Resource not found" },
//         { status: 404 }
//       );
//     }
//     // Xóa resource
//     await prisma.learningResources.delete({
//       where: { id: id },
//     });

//     return NextResponse.json({ message: "Resource deleted successfully" });
//   } catch (error) {
//     console.error("Delete resource error:", error);
//     return NextResponse.json(
//       { error: "Failed to delete resource" },
//       { status: 500 }
//     );
//   }
// }
