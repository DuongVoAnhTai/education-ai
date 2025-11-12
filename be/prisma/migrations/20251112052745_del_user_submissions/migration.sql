/*
  Warnings:

  - You are about to drop the `UserSubmissions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."UserSubmissions" DROP CONSTRAINT "UserSubmissions_exercise_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserSubmissions" DROP CONSTRAINT "UserSubmissions_user_id_fkey";

-- DropTable
DROP TABLE "public"."UserSubmissions";
