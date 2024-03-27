import { Role } from "@prisma/client";

export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: Role;
}
