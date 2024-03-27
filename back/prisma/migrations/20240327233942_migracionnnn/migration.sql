/*
  Warnings:

  - Added the required column `cityId` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Amount` to the `EventTicket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "cityId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "EventTicket" ADD COLUMN     "Amount" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;
