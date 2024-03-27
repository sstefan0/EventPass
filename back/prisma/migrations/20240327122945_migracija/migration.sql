/*
  Warnings:

  - You are about to drop the column `FristName` on the `User` table. All the data in the column will be lost.
  - Added the required column `FirstName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "FristName",
ADD COLUMN     "FirstName" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Event" (
    "Id" TEXT NOT NULL,
    "Title" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "DateTime" TIMESTAMP(3) NOT NULL,
    "Location" TEXT NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "TicketType" (
    "Id" TEXT NOT NULL,
    "Title" TEXT NOT NULL,

    CONSTRAINT "TicketType_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "EventTicket" (
    "Id" TEXT NOT NULL,
    "EventId" TEXT NOT NULL,
    "TicketTypeId" TEXT NOT NULL,
    "Price" DOUBLE PRECISION NOT NULL,
    "Description" TEXT,

    CONSTRAINT "EventTicket_pkey" PRIMARY KEY ("Id")
);

-- AddForeignKey
ALTER TABLE "EventTicket" ADD CONSTRAINT "EventTicket_EventId_fkey" FOREIGN KEY ("EventId") REFERENCES "Event"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventTicket" ADD CONSTRAINT "EventTicket_TicketTypeId_fkey" FOREIGN KEY ("TicketTypeId") REFERENCES "TicketType"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;
