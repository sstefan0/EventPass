import { Request, Response, NextFunction } from "express";
import { prisma } from "../util/prisma-client";
import HttpException from "../util/http-exception";

export const getUserInfoController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userInfo = await prisma.user.findFirst({
      where: { Id: (req as any).user.id },
    });

    if (!userInfo) throw new HttpException(404, "Not found");

    const response = {
      FirstName: userInfo.FirstName,
      LastName: userInfo.LastName,
      Email: userInfo.Email,
      PhoneNumber: userInfo.PhoneNumber,
      Role: userInfo.Role,
    };

    res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};
