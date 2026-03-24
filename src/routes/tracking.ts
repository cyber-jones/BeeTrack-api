import { Router } from "express";
import * as trackingCtrl from "../controllers/trackingController";
import { requireAuth } from "../middlewares/auth";
import { tenantMiddleware } from "../middlewares/tenant";

const router = Router();
router.use(requireAuth, tenantMiddleware);

// driver posts location updates (can be batched)
router.post("/", trackingCtrl.postEvent);

// get history
router.get("/history", trackingCtrl.getHistory);

export default router;