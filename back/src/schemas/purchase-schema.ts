import * as yup from "yup";

export const purchaseTicketSchema = yup.object({
  body: yup.object({
    eventTicketId: yup.string().uuid().required(),
    Amount: yup.number().positive().required(),
  }),
});

export const validateTicketSchema = yup.object({
  query: yup.object({
    id: yup.string().uuid().required(),
  }),
});
