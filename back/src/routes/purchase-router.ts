import express from "express";
import {
  exportAsPdfController,
  purchaseTicketsController,
  validateTicketController,
} from "../controllers/purchase-controller";
import authorize from "../middleware/auth-middleware";
import { Role } from "@prisma/client";
import {
  purchaseTicketSchema,
  validateTicketSchema,
} from "../schemas/purchase-schema";
import validate from "../middleware/validation-middleware";

const router = express.Router();

router.post(
  "/",
  authorize([Role.USER]),
  validate(purchaseTicketSchema),
  purchaseTicketsController
);
router.put(
  "/validate",
  authorize([Role.ORGANIZER]),
  validate(validateTicketSchema),
  validateTicketController
);
router.get(
  "/pdf",
  // authorize([Role.USER]),
  validate(validateTicketSchema),
  exportAsPdfController
);

export default router;
