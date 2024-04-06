import express from "express";
import validate from "../middleware/validation-middleware";
import { getCitiesSchema } from "../schemas/cities-schema";
import { getCitiesController } from "../controllers/cities-controller";

const router = express.Router();

router.get("/", validate(getCitiesSchema), getCitiesController);

export default router;
