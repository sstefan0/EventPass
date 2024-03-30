-- CreateTable
CREATE TABLE "Purchase" (
    "Id" TEXT NOT NULL,
    "Amount" INTEGER NOT NULL,
    "Price" DOUBLE PRECISION NOT NULL,
    "userId" TEXT NOT NULL,
    "eventTicketId" TEXT NOT NULL,

    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("Id")
);

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_eventTicketId_fkey" FOREIGN KEY ("eventTicketId") REFERENCES "EventTicket"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;
