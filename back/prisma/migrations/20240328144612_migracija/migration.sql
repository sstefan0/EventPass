/*
  Warnings:

  - Added the required column `eventTypeId` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_cityId_fkey";

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "eventTypeId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "EventType" (
    "Id" TEXT NOT NULL,
    "Title" TEXT NOT NULL,

    CONSTRAINT "EventType_pkey" PRIMARY KEY ("Id")
);

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_eventTypeId_fkey" FOREIGN KEY ("eventTypeId") REFERENCES "EventType"("Id") ON DELETE CASCADE ON UPDATE CASCADE;
