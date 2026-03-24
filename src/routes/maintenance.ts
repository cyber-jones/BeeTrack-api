import { Router } from "express";
import * as maintenanceCtrl from "../controllers/maintenanceController";
import { requireAuth } from "../middlewares/auth";
import { tenantMiddleware } from "../middlewares/tenant";
import { validateBody } from "../middlewares/validate";
import { createMaintenanceSchema, updateMaintenanceSchema } from "../schemas/maintenance";
import { permit } from "../middlewares/permit";

const router = Router();
router.use(requireAuth, tenantMiddleware);

router.post("/", permit("fleet_manager", "admin", "superadmin"), validateBody(createMaintenanceSchema), maintenanceCtrl.createMaintenance);
router.get("/", maintenanceCtrl.listMaintenance);
router.patch("/:id", permit("fleet_manager", "admin", "superadmin"), validateBody(updateMaintenanceSchema), maintenanceCtrl.updateMaintenance);
router.delete("/:id", permit("fleet_manager", "admin", "superadmin"), maintenanceCtrl.deleteMaintenance);

export default router;