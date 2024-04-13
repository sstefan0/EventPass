import express from "express";
import validate from "../middleware/validation-middleware";
import {
  createEventSchema,
  addTicketsSchema,
  updateEventSchema,
  deleteSchema,
  getEventsSchema,
  getEventByIdSchema,
  deleteTicketsSchema,
} from "../schemas/event-schema";
import {
  addEvenTicketsController,
  createEventController,
  deleteEventController,
  deleteTicketController,
  getEventByIdController,
  getEventStatisticsController,
  getEventTypesController,
  getEventsByOrganizerIdController,
  getEventsController,
  getTicketTypesController,
  updateEventController,
  uploadImageController,
} from "../controllers/event-controller";
import authorize from "../middleware/auth-middleware";
import { Role } from "@prisma/client";
import multer from "multer";
import { auth } from "googleapis/build/src/apis/abusiveexperiencereport";

const router = express.Router();

router.post(
  "/create",
  authorize([Role.ORGANIZER]),
  validate(createEventSchema),
  createEventController
);

router.post(
  "/add-tickets",
  authorize([Role.ORGANIZER]),
  validate(addTicketsSchema),
  addEvenTicketsController
);

router.put(
  "/update",
  authorize([Role.ORGANIZER]),
  validate(updateEventSchema),
  updateEventController
);

router.delete(
  "/delete",
  authorize([Role.ORGANIZER]),
  validate(deleteSchema),
  deleteEventController
);

router.post(
  "/delete-tickets",
  authorize([Role.ORGANIZER]),
  validate(deleteTicketsSchema),
  deleteTicketController
);

router.get("/get-all", validate(getEventsSchema), getEventsController);
router.get("/get-by-id", validate(getEventByIdSchema), getEventByIdController);
router.get(
  "/statistics",
  authorize([Role.ORGANIZER]),
  validate(getEventByIdSchema),
  getEventStatisticsController
);
router.get(
  "/organizer",
  authorize([Role.ORGANIZER]),
  getEventsByOrganizerIdController
);

router.post(
  "/upload",
  authorize([Role.ORGANIZER]),
  multer({ dest: "uploads/" }).single("image"),
  uploadImageController
);

router.get("/types", getEventTypesController);
export default router;
router.get(
  "/ticketTypes",
  authorize([Role.ORGANIZER]),
  getTicketTypesController
);
