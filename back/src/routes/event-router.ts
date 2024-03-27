import express from "express";
import validate from "../middleware/validation-middleware";
import { createEventSchema, addTicketsSchema } from "../schemas/event-schema";
import {
  addEvenTicketsController,
  createEventController,
} from "../controllers/event-controller";
import authorize from "../middleware/auth-middleware";
import { Role } from "@prisma/client";

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

export default router;
