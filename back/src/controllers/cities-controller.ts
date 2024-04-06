import { Request, Response, NextFunction } from "express";
import { prisma } from "../util/prisma-client";
import { GetCitiesDto } from "../dto/cities-dto";
export const getCitiesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const country = (req.query as unknown as GetCitiesDto).country;

    const cities = await prisma.city.findMany({
      where: { Country: country },
      select: { Id: true, Name: true },
    });

    res.status(200).json(cities);
  } catch (e) {
    next(e);
  }
};
