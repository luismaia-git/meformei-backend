-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "inative" TIMESTAMP(3),
ADD COLUMN     "recoverToken" TEXT,
ADD COLUMN     "salt" TEXT;
