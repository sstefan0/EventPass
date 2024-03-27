/*
  Warnings:

  - Added the required column `UserId` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "UserId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "EventTicket" ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventTicket" ADD CONSTRAINT "EventTicket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("Id") ON DELETE SET NULL ON UPDATE CASCADE;
