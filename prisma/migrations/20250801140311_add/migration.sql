-- CreateTable
CREATE TABLE "AnswerToTask" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "file" TEXT,
    "userId" INTEGER NOT NULL,
    "taskId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnswerToTask_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AnswerToTask" ADD CONSTRAINT "AnswerToTask_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnswerToTask" ADD CONSTRAINT "AnswerToTask_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
