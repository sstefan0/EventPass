import * as yup from "yup";

export const createEventSchema = yup.object({
  body: yup.object({
    Title: yup.string().required(),
    Description: yup.string().required(),
    DateTime: yup.date().required(),
    Location: yup.string().required(),
    cityId: yup.string().required(),
    ImageUrl: yup.string().url().required(),
  }),
});

export const addTicketsSchema = yup.object({
  body: yup.array().of(
    yup.object().shape({
      EventId: yup.string().required(),
      TicketTypeId: yup.string().required(),
      Price: yup.number().positive().required(),
      Description: yup.string().nullable(),
      Amount: yup.number().positive().required(),
    })
  ),
});

export const updateEventSchema = yup.object({
  body: yup.object({
    Id: yup.string().required().uuid(),
    Title: yup.string(),
    Description: yup.string(),
    DateTime: yup.date(),
    Location: yup.string(),
    cityId: yup.string(),
    ImageUrl: yup.string().url(),
  }),
});

export const deleteSchema = yup.object({
  query: yup.object({
    id: yup.string().uuid().required(),
  }),
});
export const deleteTicketsSchema = yup.object({
  body: yup.object({ tickets: yup.array().of(yup.string().uuid()) }),
});

export const getEventsSchema = yup.object({
  query: yup.object({
    id: yup.string().uuid().nullable(),
  }),
});
export const getEventByIdSchema = yup.object({
  query: yup.object({
    id: yup.string().uuid().required(),
  }),
});
