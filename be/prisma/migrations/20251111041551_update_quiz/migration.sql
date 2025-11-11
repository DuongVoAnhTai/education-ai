/*
  Warnings:

  - A unique constraint covering the columns `[prerequisite_id]` on the table `Exercises` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,question_id]` on the table `UserAnswers` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."QuestionAnswerKeys" DROP CONSTRAINT "QuestionAnswerKeys_question_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."QuestionOptions" DROP CONSTRAINT "QuestionOptions_question_id_fkey";

-- AlterTable
ALTER TABLE "Exercises" ADD COLUMN     "prerequisite_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Exercises_prerequisite_id_key" ON "Exercises"("prerequisite_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserAnswers_user_id_question_id_key" ON "UserAnswers"("user_id", "question_id");

-- AddForeignKey
ALTER TABLE "Exercises" ADD CONSTRAINT "Exercises_prerequisite_id_fkey" FOREIGN KEY ("prerequisite_id") REFERENCES "Exercises"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "QuestionOptions" ADD CONSTRAINT "QuestionOptions_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "Questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionAnswerKeys" ADD CONSTRAINT "QuestionAnswerKeys_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "Questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
