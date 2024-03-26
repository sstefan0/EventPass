import express from "express";
import {
  loginController,
  registerController,
} from "../controllers/auth-controller";
import validate from "../middleware/validation-middleware";
import { loginSchema, registerSchema } from "../schemas/auth-schema";

const router = express.Router();

router.post("/register", validate(registerSchema), registerController);
router.post("/login", validate(loginSchema), loginController);

export default router;
