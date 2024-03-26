import express from "express";
import {
  forgotPasswordController,
  loginController,
  registerController,
  resetPasswordController,
} from "../controllers/auth-controller";
import validate from "../middleware/validation-middleware";
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../schemas/auth-schema";

const router = express.Router();

router.post("/register", validate(registerSchema), registerController);
router.post("/login", validate(loginSchema), loginController);
router.post(
  "/forgotPassword",
  validate(forgotPasswordSchema),
  forgotPasswordController
);
router.post(
  "/resetPassword",
  validate(resetPasswordSchema),
  resetPasswordController
);

export default router;
