/*
  Warnings:

  - You are about to drop the column `process` on the `UserSkillProgress` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserSkillProgress" DROP COLUMN "process",
ADD COLUMN     "progress" DOUBLE PRECISION;
