import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const payload = verifyToken(req);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { selectedOptionId, answerText } = await req.json();

    // Lấy câu hỏi
    const question = await prisma.questions.findUnique({
      where: { id: id },
      include: {
        options: true,
        answerKeys: true,
      },
    });

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    let score = 0;

    // ==== Auto grading ====
    if (selectedOptionId) {
      // MCQ
      const option = question.options.find((o) => o.id === selectedOptionId);
      if (option?.isCorrect) {
        score = question.points;
      }
    } else if (answerText) {
      // Short answer, fill blank
      for (const key of question.answerKeys) {
        if (checkMatch(answerText, key.answerText, key.matchType)) {
          score = question.points;
          break;
        }
      }
    }

    // Lưu UserAnswer
    const userAnswer = await prisma.userAnswers.create({
      data: {
        userId: payload.userId,
        questionId: id,
        selectedOptionId,
        answerText,
        score,
      },
    });

    return NextResponse.json({ answer: userAnswer, score }, { status: 201 });
  } catch (error) {
    console.error("Submit answer error:", error);
    return NextResponse.json(
      { error: "Failed to submit answer" },
      { status: 500 }
    );
  }
}

// Helper: so khớp theo matchType
function checkMatch(
  input: string,
  expected: string,
  matchType: string
): boolean {
  switch (matchType) {
    case "EXACT":
      return input === expected;
    case "CASE_INSENSITIVE":
      return input.toLowerCase() === expected.toLowerCase();
    case "CONTAINS":
      return input.includes(expected);
    case "REGEX":
      return new RegExp(expected).test(input);
    default:
      return false;
  }
}
