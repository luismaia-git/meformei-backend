/*
  Warnings:

  - You are about to drop the column `studentRegistration` on the `CourseHistory` table. All the data in the column will be lost.
  - You are about to drop the column `studentRegistration` on the `ExtraCurricularActivitiesHistory` table. All the data in the column will be lost.
  - Added the required column `studentId` to the `CourseHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentId` to the `ExtraCurricularActivitiesHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CourseHistory" DROP CONSTRAINT "CourseHistory_studentRegistration_fkey";

-- DropForeignKey
ALTER TABLE "ExtraCurricularActivitiesHistory" DROP CONSTRAINT "ExtraCurricularActivitiesHistory_studentRegistration_fkey";

-- DropIndex
DROP INDEX "CourseHistory_studentRegistration_idx";

-- DropIndex
DROP INDEX "ExtraCurricularActivitiesHistory_studentRegistration_idx";

-- AlterTable
ALTER TABLE "CourseHistory" DROP COLUMN "studentRegistration",
ADD COLUMN     "studentId" TEXT NOT NULL,
ALTER COLUMN "endTime" SET DATA TYPE TEXT,
ALTER COLUMN "startTime" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "ExtraCurricularActivitiesHistory" DROP COLUMN "studentRegistration",
ADD COLUMN     "studentId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "CourseHistory_studentId_idx" ON "CourseHistory"("studentId");

-- CreateIndex
CREATE INDEX "ExtraCurricularActivitiesHistory_studentId_idx" ON "ExtraCurricularActivitiesHistory"("studentId");

-- AddForeignKey
ALTER TABLE "CourseHistory" ADD CONSTRAINT "CourseHistory_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExtraCurricularActivitiesHistory" ADD CONSTRAINT "ExtraCurricularActivitiesHistory_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
