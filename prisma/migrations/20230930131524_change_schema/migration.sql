/*
  Warnings:

  - You are about to drop the column `courseId` on the `Curriculum` table. All the data in the column will be lost.
  - Added the required column `courseName` to the `Curriculum` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Curriculum" DROP CONSTRAINT "Curriculum_courseId_fkey";

-- AlterTable
ALTER TABLE "Curriculum" DROP COLUMN "courseId",
ADD COLUMN     "courseName" TEXT NOT NULL;
