import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import checkMatch from "@/lib/checkMatch";
import { MatchType } from "@/generated/prisma";

export async function POST(
  req: Request,
  { params }: { params: { exerciseId: string } }
) {
  try {
    const { exerciseId } = await params;
    const payload = verifyToken(req);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { answers: submittedAnswers, timeSpentSeconds } = await req.json();

    if (!Array.isArray(submittedAnswers) || submittedAnswers.length === 0) {
      return NextResponse.json(
        { error: "No answers provided" },
        { status: 400 }
      );
    }

    // Mọi thao tác đều nằm trong đây để đảm bảo tính toàn vẹn dữ liệu
    const result = await prisma.$transaction(async (tx) => {
      // 1. Lấy thông tin bài tập và tất cả câu hỏi + Hết giờ! Hệ thđáp án đúng
      const exercise = await tx.exercises.findUnique({
        where: { id: exerciseId },
        include: {
          questions: {
            include: {
              options: true, // Lấy các lựa chọn cho câu trắc nghiệm
              answerKeys: true, // Lấy đáp án cho câu tự luận ngắn
            },
          },
        },
      });

      if (!exercise) {
        throw new Error("Exercise not found"); // Lỗi này sẽ làm transaction rollback
      }

      let totalScore = 0;
      const answerProcessingPromises = [];

      // 2. Lặp qua từng câu trả lời của người dùng để chấm điểm
      for (const question of exercise.questions) {
        const userAnswer = submittedAnswers.find(
          (a) => a.questionId === question.id
        );

        let score = 0;

        // --- LOGIC CHẤM ĐIỂM ---
        if (userAnswer) {
          switch (question.questionType) {
            case "SINGLE_CHOICE":
              if (userAnswer.selectedOptionId) {
                const selectedOption = question.options.find(
                  (o) => o.id === userAnswer.selectedOptionId
                );
                if (selectedOption?.isCorrect) score = question.points;
              }
              break;

            case "MULTIPLE_CHOICE":
              //   const correctOptionIds = new Set(
              //     question.options.filter((o) => o.isCorrect).map((o) => o.id)
              //   );
              //   const selectedOptionIds = new Set(userAnswer.selectedOptionIds);

              //   // Chấm điểm tuyệt đối: Phải chọn đúng và đủ tất cả các đáp án đúng
              //   let isFullyCorrect = true;
              //   if (correctOptionIds.size !== selectedOptionIds.size) {
              //     isFullyCorrect = false;
              //   } else {
              //     for (const id of correctOptionIds) {
              //       if (!selectedOptionIds.has(id)) {
              //         isFullyCorrect = false;

              //         break;
              //       }
              //     }
              //   }

              //   if (isFullyCorrect) {
              //     score = question.points;
              //   }
              break;

            case "SHORT_ANSWER":
            case "FILL_BLANK":
              if (userAnswer.answerText) {
                for (const key of question.answerKeys) {
                  if (
                    checkMatch(
                      userAnswer.answerText,
                      key.answerText,
                      key.matchType as MatchType
                    )
                  ) {
                    score = question.points;
                    break;
                  }
                }
              }
              break;

            case "LONG_ANSWER":
              score = 0;
              break;

            case "MATCHING":
              //   let correctMatches = 0;
              //   const correctAnswers = new Map(
              //     question.options
              //       .filter((o) => o.matchGroup === "A")
              //       .map((o) => [o.id, o.correctMatchId])
              //   );

              //   for (const pair of userAnswer.matchingPairs) {
              //     if (correctAnswers.get(pair.stemId) === pair.optionId) {
              //       correctMatches++;
              //     }
              //   }

              //   // Chấm điểm: có thể là tất cả hoặc không, hoặc chấm từng phần
              //   if (correctMatches === correctAnswers.size) {
              //     score = question.points;
              //   } else {
              //     // Chấm điểm từng phần (tùy chọn)
              //     // score = (correctMatches / correctAnswers.size) * question.points;
              //   }
              // }
              break;
          }

          totalScore += score;

          // 3. Chuẩn bị để lưu câu trả lời vào CSDL
          answerProcessingPromises.push(
            tx.userAnswers.upsert({
              where: {
                userId_questionId: {
                  userId: payload.userId,
                  questionId: question.id,
                },
              },
              update: {
                selectedOptionId: userAnswer.selectedOptionId,
                answerText: userAnswer.answerText,
                score: score,
                submittedAt: new Date(),
              },
              create: {
                userId: payload.userId,
                questionId: question.id,
                selectedOptionId: userAnswer.selectedOptionId,
                answerText: userAnswer.answerText,
                score: score,
              },
            })
          );
        }
      }

      // 4. Thực thi tất cả các thao tác lưu câu trả lời
      await Promise.all(answerProcessingPromises);

      const totalPoints = exercise.questions.reduce(
        (sum, q) => sum + q.points,
        0
      );
      const isPassed =
        exercise.passScore != null && totalPoints > 0
          ? (totalScore / totalPoints) * 100 >= exercise.passScore
          : false;

      await tx.userSubmissions.upsert({
        where: {
          userId_exerciseId: { userId: payload.userId, exerciseId: exerciseId },
        },
        update: {
          score: totalScore,
          totalPoints,
          isPassed,
          timeSpentSeconds,
          submittedAt: new Date(),
        },
        create: {
          userId: payload.userId,
          exerciseId,
          score: totalScore,
          totalPoints,
          isPassed,
          timeSpentSeconds,
        },
      });

      // 5. Cập nhật bảng tiến độ UserSkillProgress (nếu có skillId)
      if (exercise.skillId) {
        const skillExercises = await tx.exercises.findMany({
          where: { skillId: exercise.skillId },
          select: { id: true },
        });
        const totalExercisesInSkill = skillExercises.length;

        const passedSubmissionsCount = await tx.userSubmissions.count({
          where: {
            userId: payload.userId,
            exercise: { skillId: exercise.skillId },
            isPassed: true,
          },
        });

        const progress =
          totalExercisesInSkill > 0
            ? (passedSubmissionsCount / totalExercisesInSkill) * 100
            : 0;

        await tx.userSkillProgress.upsert({
          where: {
            userId_skillId: {
              userId: payload.userId,
              skillId: exercise.skillId,
            },
          },
          update: {
            progress: progress,
            completedExercises: passedSubmissionsCount,
          },
          create: {
            userId: payload.userId,
            skillId: exercise.skillId,
            progress: progress,
            completedExercises: passedSubmissionsCount,
            totalExercises: totalExercisesInSkill,
          },
        });
      }

      return { totalScore, totalPoints, isPassed };
    });
    // --- KẾT THÚC TRANSACTION ---

    return NextResponse.json(
      { success: true, message: "Bài làm đã được nộp.", result },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Submit exercise error:", error);
    if (error.message === "Exercise not found") {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to submit exercise" },
      { status: 500 }
    );
  }
}
