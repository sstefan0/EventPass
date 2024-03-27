import { Request, Response, NextFunction } from "express";
import { CreateEventDto } from "../dto/createEventDto";
import { prisma } from "../util/prisma-client";
import { AddTicketsDto } from "../dto/addTicketsDto";
import HttpException from "../util/http-exception";
import { UpdateEventDto } from "../dto/editEventDto";
import { DeleteDto } from "../dto/deleteDto";

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
