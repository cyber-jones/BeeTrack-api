import { Router } from "express";
import * as orgCtrl from "../controllers/organizationsController";
import { requireAuth } from "../middlewares/auth";
import { permit } from "../middlewares/permit";

const router = Router();

router.post("/", requireAuth, permit("superadmin"), orgCtrl.createOrganization);
router.get("/", requireAuth, permit("superadmin"), orgCtrl.listOrganizations);

export default router;