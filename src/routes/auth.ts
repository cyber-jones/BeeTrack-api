import { Router } from "express";
import * as authController from "../controllers/authController";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", requireAuth, authController.logout);
router.post("/revoke-all", requireAuth, authController.revokeAll);

export default router;