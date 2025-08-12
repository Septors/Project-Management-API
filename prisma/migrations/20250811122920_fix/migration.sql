/*
  Warnings:

  - A unique constraint covering the columns `[createrId]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "ProjectUser" DROP CONSTRAINT "ProjectUser_projectId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "Project_createrId_key" ON "Project"("createrId");

-- AddForeignKey
ALTER TABLE "ProjectUser" ADD CONSTRAINT "ProjectUser_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
