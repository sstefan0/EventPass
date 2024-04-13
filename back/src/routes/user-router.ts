import express from "express";
import authorize from "../middleware/auth-middleware";
import { getUserInfoController } from "../controllers/user-controller";

const router = express.Router();

router.get("/", authorize([]), getUserInfoController);

export default router;
