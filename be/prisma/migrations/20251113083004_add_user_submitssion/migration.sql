-- CreateTable
CREATE TABLE "UserSubmissions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "exercise_id" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "total_points" DOUBLE PRECISION NOT NULL,
    "is_passed" BOOLEAN NOT NULL,
    "time_spent_seconds" INTEGER,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserSubmissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSubmissions_user_id_exercise_id_key" ON "UserSubmissions"("user_id", "exercise_id");

-- AddForeignKey
ALTER TABLE "UserSubmissions" ADD CONSTRAINT "UserSubmissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSubmissions" ADD CONSTRAINT "UserSubmissions_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "Exercises"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
