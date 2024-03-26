import { Role } from "@prisma/client";

export interface RegisterDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: Role;
}
