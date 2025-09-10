import { PrismaClient, Role, Sender } from "../src/generated/prisma";


const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Start seeding...");

  // Tạo User
  const teacher = await prisma.user.create({
    data: {
      name: "Teacher A",
      email: "teacher@example.com",
      password: "123456", // trong thực tế phải hash
      role: Role.TEACHER,
    },
  });

  const student = await prisma.user.create({
    data: {
      name: "Student B",
      email: "student@example.com",
      password: "123456",
      role: Role.STUDENT,
    },
  });

  // Tạo Quiz
  const quiz = await prisma.quiz.create({
    data: {
      title: "Math Basics Quiz",
      description: "Quiz kiểm tra kiến thức Toán cơ bản",
      createdBy: teacher.id,
      isAI: false,
    },
  });

  // Tạo Question cho Quiz
  const questions = await prisma.question.createMany({
    data: [
      {
        quizId: quiz.id,
        content: "2 + 2 = ?",
        options: { A: "3", B: "4", C: "5", D: "6" },
        answer: "B",
      },
      {
        quizId: quiz.id,
        content: "5 × 3 = ?",
        options: { A: "15", B: "20", C: "10", D: "25" },
        answer: "A",
      },
      {
        quizId: quiz.id,
        content: "10 ÷ 2 = ?",
        options: { A: "2", B: "4", C: "5", D: "8" },
        answer: "C",
      },
    ],
  });

  // Tạo QuizAttempt (Student làm quiz)
  const attempt = await prisma.quizAttempt.create({
    data: {
      userId: student.id,
      quizId: quiz.id,
      score: 2.0, // ví dụ đúng 2/3
    },
  });

  // Lưu đáp án sinh viên
  await prisma.studentAnswer.createMany({
    data: [
      {
        attemptId: attempt.id,
        questionId: 1, // 2 + 2
        selected: "B",
        isCorrect: true,
      },
      {
        attemptId: attempt.id,
        questionId: 2, // 5 × 3
        selected: "B",
        isCorrect: false,
      },
      {
        attemptId: attempt.id,
        questionId: 3, // 10 ÷ 2
        selected: "C",
        isCorrect: true,
      },
    ],
  });

  // Chat giữa sinh viên và AI tutor
  await prisma.chatMessage.createMany({
    data: [
      {
        userId: student.id,
        sender: Sender.USER,
        message: "Thầy ơi, 2 + 2 bằng mấy?",
      },
      {
        sender: Sender.AI,
        message: "2 + 2 = 4 nhé!",
      },
    ],
  });

  console.log("✅ Seeding done!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
