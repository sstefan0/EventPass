import { Request, Response, NextFunction } from "express";
import { RegisterDto } from "../dto/RegisterDto";
import { prisma } from "../util/prisma-client";
import bcrypt from "bcrypt";
import HttpException from "../util/http-exception";
import { LoginDto } from "../dto/LoginDto";
import jwt from "jsonwebtoken";

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const loginData = req.body as LoginDto;

    const user = await prisma.user.findFirst({
      where: { Email: loginData.email },
    });

    if (!user) throw new HttpException(404, "User not found.");

    const passwordMatch = await bcrypt.compare(
      loginData.password,
      user.Password
    );

    if (!passwordMatch) throw new HttpException(401, "Unauthorized");

    const accessToken = jwt.sign(
      { name: user.FristName, role: user.Role },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    res.status(200).json({ accessToken: accessToken });
  } catch (e) {
    next(e);
  }
};

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userData = req.body as RegisterDto;
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
        Role: userData.role,
      },
    });

    res.status(200).json(newUser);
  } catch (e) {
    next(e);
  }
};
