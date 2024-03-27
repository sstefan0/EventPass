import * as yup from "yup";

export const createEventSchema = yup.object({
  body: yup.object({
    Title: yup.string().required(),
    Description: yup.string().required(),
    DateTime: yup.date().required(),
    Location: yup.string().required(),
    cityId: yup.string().required(),
  }),
});

export const addTicketsSchema = yup.object({
  body: yup.array().of(
    yup.object().shape({
      EventId: yup.string().required(),
      TicketTypeId: yup.string().required(),
      Price: yup.number().positive().required(),
      Description: yup.string().nullable(),
    })
  ),
});
