import express from "express";
import validate from "../middleware/validation-middleware";
import {
  createEventSchema,
  addTicketsSchema,
  updateEventSchema,
  deleteSchema,
  getEventsSchema,
  getEventByIdSchema,
} from "../schemas/event-schema";
import {
  addEvenTicketsController,
  createEventController,
  deleteEventController,
  deleteTicketController,
  getEventByIdController,
  getEventStatisticsController,
  getEventsController,
  updateEventController,
  uploadImageController,
} from "../controllers/event-controller";
import authorize from "../middleware/auth-middleware";
import { Role } from "@prisma/client";
import multer from "multer";

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

router.delete(
  "/delete-ticket",
  authorize([Role.ORGANIZER]),
  validate(deleteSchema),
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

router.post(
  "/upload",
  multer({ dest: "uploads/" }).single("image"),
  uploadImageController
);

export default router;
