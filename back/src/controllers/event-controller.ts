import { Request, Response, NextFunction, json } from "express";
import { prisma } from "../util/prisma-client";
import HttpException from "../util/http-exception";
import { google } from "googleapis";
import {
  AddTicketsDto,
  DeleteDto,
  CreateEventDto,
  GetEventDto,
  GetEventsDto,
  UpdateEventDto,
  DeleteTicketsDto,
} from "../dto/event-dto";
import fs, { PathLike } from "fs";
import { randomUUID } from "crypto";
import { generateImageUrl } from "../util/generate-image-url";

export const createEventController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const eventData = req.body as CreateEventDto;
    const event = await prisma.event.create({
      data: { ...eventData, userId: (req as any).user.id },
    });

    res.status(201).json(event);
  } catch (e) {
    next(e);
  }
};

export const addEvenTicketsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const ticketsData = req.body as AddTicketsDto[];
    const event = await prisma.event.findFirst({
      where: { Id: ticketsData[0].EventId },
    });

    if (!event) throw new HttpException(404, "Event not found.");
    if (event.userId != (req as any).user.id)
      throw new HttpException(403, "You can not update this event");

    const eventTickets = await prisma.eventTicket.createMany({
      data: ticketsData,
    });

    res.status(201).json(eventTickets);
  } catch (e) {
    next(e);
  }
};

export const updateEventController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newData = req.body as UpdateEventDto;
    const event = await prisma.event.findFirst({ where: { Id: newData.Id } });
    if (!event) throw new HttpException(404, "Event not found");
    if (event.userId != (req as any).user.id)
      throw new HttpException(
        401,
        "You do not have permission to update this event"
      );
    const updatedEvent = await prisma.event.update({
      where: { Id: newData.Id },
      data: newData,
    });

    res.status(200).json(updatedEvent);
  } catch (e) {
    next(e);
  }
};

export const deleteEventController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const eventId = (req.query as unknown as DeleteDto).id;

    const deletedEvent = await prisma.event.delete({
      where: { Id: eventId },
    });

    res.status(200).json(deletedEvent);
  } catch (e) {
    next(e);
  }
};

export const deleteTicketController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const ticketIds = req.body as DeleteTicketsDto;
    const deletedTicket = await prisma.eventTicket.deleteMany({
      where: { Id: { in: ticketIds.tickets } },
    });
    res.status(200).json(deletedTicket);
  } catch (e) {
    next(e);
  }
};

export const getEventsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reqParams = req.query as unknown as GetEventsDto;
    if (reqParams.id) {
      const events = await prisma.event.findMany({
        where: { eventTypeId: reqParams.id },
        include: {
          City: { select: { Country: true } },
        },
        orderBy: { DateTime: "asc" },
      });
      res.status(200).json(events);
    } else {
      const events = await prisma.event.findMany({
        include: { City: { select: { Country: true } } },
        orderBy: { DateTime: "asc" },
      });
      res.status(200).json(events);
    }
  } catch (e) {
    next(e);
  }
};

export const getEventByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const eventId = (req.query as unknown as GetEventDto).id;

    const event = await prisma.event.findFirst({
      where: { Id: eventId },
      select: {
        Title: true,
        Description: true,
        DateTime: true,
        Location: true,
        ImageUrl: true,
        eventTypeId: true,
        City: {
          select: {
            Id: true,
            Name: true,
            Country: true,
          },
        },
      },
    });

    const tickets = await prisma.eventTicket.findMany({
      where: { EventId: eventId },
      select: {
        Ticket: { select: { Title: true } },
        Id: true,
        Description: true,
        Price: true,
        Amount: true,
      },
      orderBy: { Price: "asc" },
    });

    const formattedTickets = tickets.map((ticket) => ({
      id: ticket.Id,
      title: ticket.Ticket.Title,
      description: ticket.Description,
      price: ticket.Price,
      amount: ticket.Amount,
    }));

    const resData = {
      id: eventId,
      title: event?.Title,
      description: event?.Description,
      dateTime: event?.DateTime,
      location: event?.Location,
      city: event?.City.Name,
      cityId: event?.City.Id,
      country: event?.City.Country,
      tickets: formattedTickets,
      imageUrl: event?.ImageUrl,
      eventTypeId: event?.eventTypeId,
    };

    res.status(200).json(resData);
  } catch (e) {
    next(e);
  }
};

export const getEventStatisticsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const eventId = (req.query as unknown as GetEventDto).id;

    const purchases = await prisma.purchase.findMany({
      where: { Ticket: { Event: { Id: eventId } } },
    });

    const ticketTypes = await prisma.eventTicket.findMany({
      where: { EventId: eventId },
    });

    let totalTickets = 0;
    ticketTypes.forEach((ticketType) => {
      totalTickets += ticketType.Amount;
    });
    let money = 0;
    let sold = 0;
    purchases.forEach((purchase) => {
      money += purchase.Price;
      sold += purchase.Amount;
    });

    res
      .status(200)
      .json({ profit: money, soldTickets: sold, ticketsLeft: totalTickets });
  } catch (e) {
    next(e);
  }
};

export const getEventsByOrganizerIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const events = await prisma.event.findMany({
      where: { userId: (req as any).user.id },
    });

    res.status(200).json(events);
  } catch (e) {
    next(e);
  }
};

export const uploadImageController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const OAuth2 = google.auth.OAuth2;
    const oauth2Client = new OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      "https://developers.google.com/oauthplayground"
    );
    new OAuth2({});
    oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

    const accessToken = await new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          reject("Failed to create access token.");
        }
        resolve(token);
      });
    });

    const drive = google.drive({
      version: "v3",
      auth: oauth2Client,
    });

    const fileMetadata = {
      name: randomUUID(),
      parents: ["10dx91QEvEErNDT_YwMKm4ypfVi0FbUL7"],
    };
    const media = {
      mimeType: (req as any).file?.mimetype,
      body: fs.createReadStream((req as any).file?.path as PathLike),
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id",
    });

    const url = generateImageUrl(response.data.id!);
    res.status(200).json({ imageUrl: url });
  } catch (e) {
    next(e);
  }
};

export const getEventTypesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await prisma.eventType.findMany();
    res.status(200).json(data);
  } catch (e) {
    next(e);
  }
};
export const getTicketTypesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await prisma.ticketType.findMany();

    res.status(200).json(data);
  } catch (e) {
    next(e);
  }
};
