import express from "express";
import * as authController from "../controllers/auth.js";
import sendResetEmail from "../controllers/sendResetEmail.js";
import validateBody from "../middlewares/validateBody.js";
import { emailSchema, resetPasswordSchema } from "../schemas/authSchemas.js";
import resetPassword from "../controllers/resetPassword.js";

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);

router.post("/send-reset-email", validateBody(emailSchema), sendResetEmail);
router.post("/reset-pwd", validateBody(resetPasswordSchema), resetPassword);

export default router;
