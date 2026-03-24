import { Router } from "express";
import * as vehiclesCtrl from "../controllers/vehiclesController";
import { requireAuth } from "../middlewares/auth";
import { tenantMiddleware } from "../middlewares/tenant";
import { validateBody } from "../middlewares/validate";
import { createVehicleSchema } from "../schemas/vehicle";
import { permit } from "../middlewares/permit";

const router = Router();
router.use(requireAuth, tenantMiddleware);

// List accepts q, page, limit, sort
router.get("/", vehiclesCtrl.listVehicles);

router.post("/", permit("admin", "dispatcher", "superadmin"), validateBody(createVehicleSchema), vehiclesCtrl.createVehicle);
router.get("/:id", vehiclesCtrl.getVehicle);
router.patch("/:id", vehiclesCtrl.updateVehicle);
router.delete("/:id", vehiclesCtrl.deleteVehicle);

export default router;