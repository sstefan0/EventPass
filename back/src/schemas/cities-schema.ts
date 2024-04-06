import { CountryCode } from "@prisma/client";
import * as yup from "yup";

export const getCitiesSchema = yup.object({
  query: yup.object({
    country: yup
      .string()
      .oneOf([
        CountryCode.BIH,
        CountryCode.CRO,
        CountryCode.MNE,
        CountryCode.SRB,
      ])
      .required(),
  }),
});
