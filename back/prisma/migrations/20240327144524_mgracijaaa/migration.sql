-- CreateEnum
CREATE TYPE "CountryCode" AS ENUM ('BIH', 'SRB', 'CRO', 'MNE');

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_userId_fkey";

-- DropForeignKey
ALTER TABLE "EventTicket" DROP CONSTRAINT "EventTicket_EventId_fkey";

-- DropForeignKey
ALTER TABLE "EventTicket" DROP CONSTRAINT "EventTicket_TicketTypeId_fkey";

-- CreateTable
CREATE TABLE "City" (
    "Id" TEXT NOT NULL,
    "Country" "CountryCode" NOT NULL,
    "Name" TEXT NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("Id")
);

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventTicket" ADD CONSTRAINT "EventTicket_EventId_fkey" FOREIGN KEY ("EventId") REFERENCES "Event"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventTicket" ADD CONSTRAINT "EventTicket_TicketTypeId_fkey" FOREIGN KEY ("TicketTypeId") REFERENCES "TicketType"("Id") ON DELETE CASCADE ON UPDATE CASCADE;
