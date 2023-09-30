/*
  Warnings:

  - You are about to drop the column `courseId` on the `Curriculum` table. All the data in the column will be lost.
  - Added the required column `courseName` to the `Curriculum` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Curriculum" DROP CONSTRAINT "Curriculum_courseId_fkey";

-- Criando a coluna de courseName
ALTER TABLE "Curriculum"
ADD COLUMN "courseName" TEXT;

-- aqui eu atualizo o courseName de acordo com seu courseId
UPDATE "Curriculum" c
SET "courseName" = (SELECT name FROM "Course" WHERE "id" = c."courseId");

-- AlterTable
ALTER TABLE "Curriculum" DROP COLUMN "courseId";

-- Tornando a coluna courseName NOT NULL
ALTER TABLE "Curriculum"
ALTER COLUMN "courseName" SET NOT NULL;
