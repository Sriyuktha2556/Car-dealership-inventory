import { Router } from "express";
import { login, register } from "../controllers/auth.controller";
import { asyncHandler } from "../middleware/errorHandler";
import { validate } from "../middleware/validate";
import { loginSchema, registerSchema } from "../utils/validation";

const router = Router();

router.post("/register", validate(registerSchema), asyncHandler(register));
router.post("/login", validate(loginSchema), asyncHandler(login));

export default router;
