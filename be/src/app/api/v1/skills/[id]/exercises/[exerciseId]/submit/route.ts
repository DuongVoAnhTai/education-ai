import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import checkMatch from "@/lib/checkMatch";

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

    const submittedAnswers: UserSubmissionAnswer[] = await req.json();
    if (!Array.isArray(submittedAnswers) || submittedAnswers.length === 0) {
      return NextResponse.json(
        { error: "No answers provided" },
        { status: 400 }
      );
    }

    // Mọi thao tác đều nằm trong đây để đảm bảo tính toàn vẹn dữ liệu
    const submissionResult = await prisma.$transaction(async (tx) => {
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
      for (const userAnswer of submittedAnswers) {
        const question = exercise.questions.find(
          (q) => q.id === userAnswer.questionId
        );
        if (!question) continue; // Bỏ qua nếu câu hỏi không thuộc bài tập này

        let score = 0;

        // --- LOGIC CHẤM ĐIỂM ---
        if (
          question.questionType === "SINGLE_CHOICE" &&
          userAnswer.selectedOptionId
        ) {
          const selectedOption = question.options.find(
            (o) => o.id === userAnswer.selectedOptionId
          );
          if (selectedOption?.isCorrect) {
            score = question.points;
          }
        } else if (
          (question.questionType === "SHORT_ANSWER" ||
            question.questionType === "FILL_BLANK") &&
          userAnswer.answerText
        ) {
          for (const key of question.answerKeys) {
            if (
              checkMatch(userAnswer.answerText, key.answerText, key.matchType)
            ) {
              score = question.points;
              break; // Dừng lại khi tìm thấy một đáp án đúng
            }
          }
        }
        // else if (
        //   question.questionType === "MULTIPLE_CHOICE" &&
        //   userAnswer.selectedOptionIds &&
        //   Array.isArray(userAnswer.selectedOptionIds)
        // ) {
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
        //   // (Tùy chọn nâng cao: chấm điểm từng phần nếu chỉ đúng một vài lựa chọn)
        // }
        else if (
          question.questionType === "LONG_ANSWER" &&
          userAnswer.answerText
        ) {
          score = 0; // Gán điểm mặc định là 0, chờ chấm thủ công
        } 
        // else if (
        //   question.questionType === "MATCHING" &&
        //   userAnswer.matchingPairs
        // ) {
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

      // 4. Thực thi tất cả các thao tác lưu câu trả lời
      await Promise.all(answerProcessingPromises);

      // a. Lấy TẤT CẢ các bài tập thuộc về SKILL này
      const allExercisesInSkill = await tx.exercises.findMany({
        where: { skillId: exercise.skillId },
        include: { questions: { select: { points: true } } },
      });
      const totalExercisesInSkill = allExercisesInSkill.length;

      // b. Lấy TẤT CẢ các câu trả lời của user cho TOÀN BỘ SKILL
      const allUserAnswersInSkill = await tx.userAnswers.findMany({
        where: {
          userId: payload.userId,
          question: { exercise: { skillId: exercise.skillId } },
        },
        select: { score: true, question: { select: { exerciseId: true } } },
      });

      // c. Tính toán lại số bài tập đã đạt
      let passedExercisesCount = 0;
      const scoresByExercise = allUserAnswersInSkill.reduce((acc, answer) => {
        const exerciseId = answer.question?.exerciseId;
        if (!exerciseId) return acc;

        if (!acc[exerciseId]) {
          acc[exerciseId] = 0;
        }
        acc[exerciseId] += answer.score || 0;
        return acc;
      }, {} as Record<string, number>);

      // Bây giờ, `scoresByExercise` chứa điểm của các bài đã làm TRƯỚC ĐÓ.
      // Chúng ta cần cập nhật nó với kết quả của bài vừa nộp.
      scoresByExercise[exerciseId] = totalScore;

      for (const ex of allExercisesInSkill) {
        const userScore = scoresByExercise[ex.id];
        if (userScore !== undefined && ex.passScore != null) {
          const totalPoints = ex.questions.reduce(
            (sum, q) => sum + q.points,
            0
          );
          if (
            totalPoints > 0 &&
            (userScore / totalPoints) * 100 >= ex.passScore
          ) {
            passedExercisesCount++;
          }
        }
      }

      // 5. Cập nhật tiến độ của người dùng với kỹ năng (nếu có)
      if (exercise.skillId) {
        await tx.userSkillProgress.upsert({
          where: {
            userId_skillId: {
              userId: payload.userId,
              skillId: exercise.skillId,
            },
          },
          update: {
            completedExercises: passedExercisesCount,
          },
          create: {
            userId: payload.userId,
            skillId: exercise.skillId,
            completedExercises: passedExercisesCount,
            totalExercises: totalExercisesInSkill,
          },
        });
      }

      const totalPoints = exercise.questions.reduce(
        (sum, q) => sum + q.points,
        0
      );

      return {
        totalScore,
        totalPoints,
        isPassed:
          exercise.passScore != null ? totalScore >= exercise.passScore : null,
      };
    });
    // --- KẾT THÚC TRANSACTION ---

    return NextResponse.json(
      { message: "Bài làm đã được nộp thành công!", result: submissionResult },
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
