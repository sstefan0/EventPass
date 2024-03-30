import { Request, Response, NextFunction } from "express";
import { prisma } from "../util/prisma-client";
import HttpException from "../util/http-exception";
import { CountryCode } from "@prisma/client";
import {
  AddTicketsDto,
  DeleteDto,
  CreateEventDto,
  GetEventDto,
  GetEventsDto,
  UpdateEventDto,
} from "../dto/event-dto";

export const createEventController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const eventData = req.body as CreateEventDto;
    console.log(req.user);
    const event = await prisma.event.create({
      data: { ...eventData, userId: req.user.id },
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
    if (event.userId != req.user.id)
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
    if (event.userId != req.user.id)
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
    const ticketId = (req.query as unknown as DeleteDto).id;
    const deletedTicket = await prisma.eventTicket.delete({
      where: { Id: ticketId },
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
    const reqParams = req.body as GetEventsDto;
    let events;
    let searchParams: any = {};
    if (!reqParams.startDate && !reqParams.endDate) {
      reqParams.startDate = new Date();
      reqParams.endDate = new Date("2124-01-01T00:00:00z");
    }
    if (reqParams.eventTypeId) searchParams.eventTypeId = reqParams.eventTypeId;

    if (reqParams.cityId) searchParams.cityId = reqParams.cityId;
    else if (reqParams.countryCode) {
      events = await prisma.event.findMany({
        where: {
          ...searchParams,
          City: { Country: reqParams.countryCode as CountryCode },
          DateTime: {
            lte: reqParams.endDate,
            gte: reqParams.startDate,
          },
        },
      });
      res.status(200).json(events);
    }
    events = await prisma.event.findMany({
      where: {
        ...searchParams,
        DateTime: {
          lte: reqParams.endDate,
          gte: reqParams.startDate,
        },
      },
    });
    res.status(200).json(events);
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
        City: {
          select: {
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
        Description: true,
        Price: true,
        Amount: true,
      },
    });

    const formattedTickets = tickets.map((ticket) => ({
      title: ticket.Ticket.Title,
      description: ticket.Description,
      price: ticket.Price,
      amount: ticket.Amount,
    }));

    const resData = {
      title: event?.Title,
      description: event?.Description,
      dateTime: event?.DateTime,
      location: event?.Location,
      city: event?.City.Name,
      country: event?.City.Country,
      tickets: formattedTickets,
    };

    res.status(200).json(resData);
  } catch (e) {
    next(e);
  }
};
