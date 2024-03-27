/*
  Warnings:

  - You are about to drop the column `UserId` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `EventTicket` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_UserId_fkey";

-- DropForeignKey
ALTER TABLE "EventTicket" DROP CONSTRAINT "EventTicket_userId_fkey";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "UserId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "EventTicket" DROP COLUMN "userId";

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;
