-- CreateTable
CREATE TABLE "UserSkillProgress" (
    "user_id" TEXT NOT NULL,
    "skill_id" TEXT NOT NULL,
    "completed_exercises" INTEGER,
    "total_exercises" INTEGER,

    CONSTRAINT "UserSkillProgress_pkey" PRIMARY KEY ("user_id","skill_id")
);

-- AddForeignKey
ALTER TABLE "UserSkillProgress" ADD CONSTRAINT "UserSkillProgress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSkillProgress" ADD CONSTRAINT "UserSkillProgress_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "Skills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
