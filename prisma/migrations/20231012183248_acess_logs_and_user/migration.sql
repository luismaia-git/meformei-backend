-- CreateEnum
CREATE TYPE "TypeUser" AS ENUM ('ADMIN', 'STUDENT', 'ANONYMOUS');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "AccessLogs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "ipUser" TEXT,
    "typeUser" "TypeUser" NOT NULL,

    CONSTRAINT "AccessLogs_pkey" PRIMARY KEY ("id")
);
