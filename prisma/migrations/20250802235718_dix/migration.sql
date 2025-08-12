-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_targetId_fkey";

-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "targetId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
