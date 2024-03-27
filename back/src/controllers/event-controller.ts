import { Request, Response, NextFunction } from "express";
import { CreateEventDto } from "../dto/createEventDto";
import { prisma } from "../util/prisma-client";
import { AddTicketsDto } from "../dto/addTicketsDto";
import HttpException from "../util/http-exception";

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
