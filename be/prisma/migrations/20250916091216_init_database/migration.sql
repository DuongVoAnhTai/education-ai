/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."Visibility" AS ENUM ('PUBLIC', 'PRIVATE', 'UNLISTED');

-- CreateEnum
CREATE TYPE "public"."ResourceType" AS ENUM ('LINK', 'ARTICLE', 'VIDEO', 'FILE', 'NOTE');

-- CreateEnum
CREATE TYPE "public"."QuestionType" AS ENUM ('SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'SHORT_ANSWER', 'LONG_ANSWER', 'FILL_BLANK', 'MATCHING');

-- CreateEnum
CREATE TYPE "public"."MatchType" AS ENUM ('EXACT', 'CASE_INSENSITIVE', 'REGEX', 'CONTAINS');

-- CreateEnum
CREATE TYPE "public"."SenderType" AS ENUM ('USER', 'AI', 'SYSTEM');

-- CreateEnum
CREATE TYPE "public"."ContentType" AS ENUM ('TEXT', 'HTML', 'JSON', 'COMMAND');

-- DropTable
DROP TABLE "public"."User";

-- CreateTable
CREATE TABLE "public"."Users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "full_name" TEXT,
    "role" TEXT,
    "avatar_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Skills" (
    "id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "visibility" "public"."Visibility" NOT NULL DEFAULT 'PRIVATE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SkillTags" (
    "skill_id" TEXT NOT NULL,
    "tag_id" TEXT NOT NULL,

    CONSTRAINT "SkillTags_pkey" PRIMARY KEY ("skill_id","tag_id")
);

-- CreateTable
CREATE TABLE "public"."LearningResources" (
    "id" TEXT NOT NULL,
    "skill_id" TEXT,
    "title" TEXT,
    "resource_type" "public"."ResourceType",
    "url" TEXT,
    "content" TEXT,
    "ordering" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LearningResources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Exercises" (
    "id" TEXT NOT NULL,
    "skill_id" TEXT,
    "title" TEXT,
    "description" TEXT,
    "ordering" INTEGER,
    "time_limit_seconds" INTEGER,
    "pass_score" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Questions" (
    "id" TEXT NOT NULL,
    "exercise_id" TEXT,
    "question_type" "public"."QuestionType" NOT NULL,
    "prompt" TEXT NOT NULL,
    "points" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "ordering" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."QuestionOptions" (
    "id" TEXT NOT NULL,
    "question_id" TEXT,
    "content" TEXT NOT NULL,
    "is_correct" BOOLEAN NOT NULL DEFAULT false,
    "ordering" INTEGER,

    CONSTRAINT "QuestionOptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."QuestionAnswerKeys" (
    "id" TEXT NOT NULL,
    "question_id" TEXT,
    "answer_text" TEXT NOT NULL,
    "match_type" "public"."MatchType" NOT NULL,

    CONSTRAINT "QuestionAnswerKeys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserAnswers" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "question_id" TEXT,
    "selected_option_id" TEXT,
    "answer_text" TEXT,
    "score" DOUBLE PRECISION,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserAnswers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Conversations" (
    "id" TEXT NOT NULL,
    "created_by" TEXT,
    "title" TEXT,
    "is_group" BOOLEAN NOT NULL DEFAULT false,
    "allow_ai" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ConversationParticipants" (
    "conversation_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "is_ai" BOOLEAN NOT NULL DEFAULT false,
    "is_muted" BOOLEAN NOT NULL DEFAULT false,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConversationParticipants_pkey" PRIMARY KEY ("conversation_id","user_id","is_ai")
);

-- CreateTable
CREATE TABLE "public"."Messages" (
    "id" TEXT NOT NULL,
    "conversation_id" TEXT NOT NULL,
    "sender_user_id" TEXT,
    "sender_type" "public"."SenderType" NOT NULL,
    "content" TEXT,
    "content_type" "public"."ContentType" NOT NULL DEFAULT 'TEXT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "public"."Users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "public"."Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Tags_name_key" ON "public"."Tags"("name");

-- AddForeignKey
ALTER TABLE "public"."Skills" ADD CONSTRAINT "Skills_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "public"."Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SkillTags" ADD CONSTRAINT "SkillTags_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "public"."Skills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SkillTags" ADD CONSTRAINT "SkillTags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "public"."Tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LearningResources" ADD CONSTRAINT "LearningResources_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "public"."Skills"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Exercises" ADD CONSTRAINT "Exercises_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "public"."Skills"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Questions" ADD CONSTRAINT "Questions_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "public"."Exercises"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QuestionOptions" ADD CONSTRAINT "QuestionOptions_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "public"."Questions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."QuestionAnswerKeys" ADD CONSTRAINT "QuestionAnswerKeys_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "public"."Questions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserAnswers" ADD CONSTRAINT "UserAnswers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserAnswers" ADD CONSTRAINT "UserAnswers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "public"."Questions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserAnswers" ADD CONSTRAINT "UserAnswers_selected_option_id_fkey" FOREIGN KEY ("selected_option_id") REFERENCES "public"."QuestionOptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Conversations" ADD CONSTRAINT "Conversations_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ConversationParticipants" ADD CONSTRAINT "ConversationParticipants_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "public"."Conversations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ConversationParticipants" ADD CONSTRAINT "ConversationParticipants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Messages" ADD CONSTRAINT "Messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "public"."Conversations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Messages" ADD CONSTRAINT "Messages_sender_user_id_fkey" FOREIGN KEY ("sender_user_id") REFERENCES "public"."Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
