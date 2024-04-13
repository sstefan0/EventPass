-- DropForeignKey
ALTER TABLE "Purchase" DROP CONSTRAINT "Purchase_eventTicketId_fkey";

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_eventTicketId_fkey" FOREIGN KEY ("eventTicketId") REFERENCES "EventTicket"("Id") ON DELETE CASCADE ON UPDATE CASCADE;
