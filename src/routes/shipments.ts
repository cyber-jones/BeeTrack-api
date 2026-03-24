import { Router } from "express";
import * as shipmentsCtrl from "../controllers/shipmentsController";
import { requireAuth } from "../middlewares/auth";
import { tenantMiddleware } from "../middlewares/tenant";
import { validateBody } from "../middlewares/validate";
import { createShipmentSchema, assignShipmentSchema } from "../schemas/shipment";
import { permit } from "../middlewares/permit";

const router = Router();
router.use(requireAuth, tenantMiddleware);

router.post("/", permit("customer", "admin", "dispatcher"), validateBody(createShipmentSchema), shipmentsCtrl.createShipment);
router.post("/assign", permit("dispatcher", "admin"), validateBody(assignShipmentSchema), shipmentsCtrl.assignShipment);
router.get("/", shipmentsCtrl.listShipments);
router.get("/:id", shipmentsCtrl.getShipment);
router.patch("/:id", shipmentsCtrl.updateShipment);
router.delete("/:id", shipmentsCtrl.deleteShipment);

export default router;