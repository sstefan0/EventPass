import { CountryCode } from "@prisma/client";

export interface GetCitiesDto {
  country: CountryCode;
}
