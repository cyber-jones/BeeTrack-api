import { Router } from "express";
import * as usersCtrl from "../controllers/usersController";
import { requireAuth } from "../middlewares/auth";
import { tenantMiddleware } from "../middlewares/tenant";

const router = Router();

router.use(requireAuth, tenantMiddleware);

router.get("/", usersCtrl.listUsers);
router.get("/:id", usersCtrl.getUser);
router.post("/", usersCtrl.createUser);
router.patch("/:id", usersCtrl.updateUser);
router.delete("/:id", usersCtrl.deleteUser);

export default router;