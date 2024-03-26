-- AlterTable
ALTER TABLE "User" ADD COLUMN     "ExpiresAt" TIMESTAMP(3),
ADD COLUMN     "ResetToken" TEXT;
