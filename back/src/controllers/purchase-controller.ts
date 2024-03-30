import { Request, Response, NextFunction } from "express";
import { PurchaseTicketDto, ValidateDto } from "../dto/purchase-dto";
import { prisma } from "../util/prisma-client";
import HttpException from "../util/http-exception";
import { generateQRCode } from "../util/qr-generator";
import {
  generateHTMLConfirmationMessage,
  generatePdfHTML,
  sendEmail,
} from "../util/mail-sender";
import pdf, { CreateOptions } from "html-pdf";

export const purchaseTicketsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const purchaseData = req.body as PurchaseTicketDto;

    const ticket = await prisma.eventTicket.findFirst({
      where: { Id: purchaseData.eventTicketId },
      include: {
        Event: { select: { Title: true, Location: true, DateTime: true } },
      },
    });

    if (!ticket) throw new HttpException(404, "Ticket not found.");

    if (ticket.Amount < purchaseData.Amount)
      throw new HttpException(400, "Not enough tickets left.");

    console.log(purchaseData);
    const price = ticket.Price * purchaseData.Amount;
    const newAmount = ticket.Amount - purchaseData.Amount;

    await prisma.eventTicket.update({
      where: { Id: purchaseData.eventTicketId },
      data: { Amount: newAmount },
    });

    const purchase = await prisma.purchase.create({
      data: { userId: req.user.id, ...purchaseData, Price: price },
      include: { Ticket: { include: { Ticket: true } } },
    });
    const code = await generateQRCode(
      "http://localhost:" + process.env.PORT + "/validate?id=" + purchase.Id
    );

    const mailOptions = {
      from: "eventpass0@gmail.com",
      to: req.user.email,
      subject: "Ticket purchase receipt",
      html: await generateHTMLConfirmationMessage(
        ticket.Event.Title,
        ticket.Event.Location,
        ticket.Event.DateTime.toDateString(),
        purchase.Price,
        purchase.purchasedAt.toLocaleString(),
        purchase.Ticket.Ticket.Title,
        purchase.Amount
      ),
      attachments: [
        {
          filename: "qr_code.png",
          content: code.split(";base64,").pop(),
          encoding: "base64",
          cid: "qrCodeImage",
        },
      ],
    };

    await sendEmail(mailOptions);

    res.status(200).json(purchase);
  } catch (e) {
    next(e);
  }
};

export const validateTicketController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = (req.query as unknown as ValidateDto).id;
    const ticket = await prisma.purchase.findFirst({ where: { Id: id } });
    if (!ticket) throw new HttpException(404, "Ticket not found");
    console.log(ticket);
    if (ticket.Validated)
      throw new HttpException(403, "Ticket already validated.");

    const updatedTicket = await prisma.purchase.update({
      where: { Id: id },
      data: { Validated: true },
    });

    res.status(200).json(updatedTicket);
  } catch (e) {
    next(e);
  }
};

export const exportAsPdfController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const ticketId = (req.query as unknown as ValidateDto).id;

    const ticket = await prisma.purchase.findFirst({
      where: { Id: ticketId },
      include: { Ticket: { include: { Event: true, Ticket: true } } },
    });
    if (!ticket) throw new HttpException(404, "Ticket not found");
    const htmlContent = await generatePdfHTML(
      ticket.Id,
      ticket?.Ticket.Event.Title,
      ticket?.Ticket.Event.Location,
      ticket?.Ticket.Event.DateTime.toLocaleString(),
      ticket?.Price,
      ticket?.purchasedAt.toLocaleString(),
      ticket.Ticket.Ticket.Title,
      ticket.Amount
    );

    const stream = await new Promise((resolve, reject) => {
      pdf
        .create(htmlContent, {
          format: "A5",
          orientation: "landscape",
        })
        .toStream((err, stream) => {
          if (err) next(err);
          res.setHeader("Content-Type", "application-pdf");
          res.setHeader(
            "Content-Disposition",
            'attachment; filename="example.pdf"'
          );
          stream.pipe(res);
        });
    });
  } catch (e) {
    next(e);
  }
};
