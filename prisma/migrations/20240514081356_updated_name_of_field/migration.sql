/*
  Warnings:

  - You are about to drop the column `Answer` on the `questions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "questions" DROP COLUMN "Answer",
ADD COLUMN     "answer" INTEGER[];
