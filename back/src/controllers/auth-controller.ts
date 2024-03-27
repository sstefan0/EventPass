import { Request, Response, NextFunction, response } from "express";
import { RegisterDto } from "../dto/RegisterDto";
import { prisma } from "../util/prisma-client";
import bcrypt from "bcrypt";
import HttpException from "../util/http-exception";
import { LoginDto } from "../dto/LoginDto";
import jwt from "jsonwebtoken";
import { ForgotPasswordDto } from "../dto/forgotPasswordDto";
import { generateHTMLMessage, sendEmail } from "../util/mail-sender";
import crypto from "crypto";
import { ResetPasswordDto } from "../dto/resetPasswordDto";

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
      { id: user.Id, name: user.FirstName, role: user.Role, email: user.Email },
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
        FirstName: userData.firstName,
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

export const forgotPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const email = (req.body as ForgotPasswordDto).email;

    const user = await prisma.user.findFirst({ where: { Email: email } });

    if (!user) throw new HttpException(404, "Not found");

    const resetToken = crypto.randomBytes(64).toString("hex");

    const expirationTIme = new Date();
    expirationTIme.setHours(expirationTIme.getHours() + 2);
    await prisma.user.update({
      where: { Id: user.Id },
      data: {
        ResetToken: resetToken as string,
        ExpiresAt: expirationTIme,
      },
    });

    const mail = await sendEmail({
      from: "eventpass0@gmail.com",
      to: user.Email,
      subject: "test",
      html: generateHTMLMessage(user.FirstName, resetToken),
    });
    console.log(req.user);
    res.status(200).json({
      message: "Check your email for further details.\n",
    });
  } catch (e) {
    next(e);
  }
};

export const resetPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userData = req.body as ResetPasswordDto;

    const user = await prisma.user.findFirst({
      where: { ResetToken: userData.token },
    });

    if (!user) throw new HttpException(404, "Not found");

    const currentTime = new Date();
    if (currentTime > user.ExpiresAt!)
      throw new HttpException(498, "Token expired/invalid");

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    await prisma.user.update({
      where: { Id: user.Id },
      data: { Password: hashedPassword, ExpiresAt: new Date() },
    });

    res.status(200).json({ message: "Password changed successfully." });
  } catch (e) {
    next(e);
  }
};
