import { Request, Response, NextFunction } from "express";
import { RegisterDto } from "../dto/RegisterDto";
import { prisma } from "../util/prisma-client";
import bcrypt from "bcrypt";
import HttpException from "../util/http-exception";

export const loginController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userData = req.body as RegisterDto;
    console.log(req.body);
    const hashedPassword: string = await bcrypt.hash(userData.password, 10);

    const available: boolean = (await prisma.user.findFirst({
      where: { Email: userData.email },
    }))
      ? false
      : true;
    if (!available) throw new HttpException(409, "Email Unavailable");

    const newUser = await prisma.user.create({
      data: {
        FristName: userData.firstName,
        LastName: userData.lastName,
        Email: userData.email,
        PhoneNumber: userData.phoneNumber,
        Password: hashedPassword,
      },
    });

    res.status(200).json(newUser);
  } catch (e) {
    next(e);
  }
};
