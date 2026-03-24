import { Router } from "express";
import * as rolesCtrl from "../controllers/rolesController";
import { requireAuth } from "../middlewares/auth";
import { permit } from "../middlewares/permit";
import { validateBody } from "../middlewares/validate";
import { createRoleSchema, updateRoleSchema } from "../schemas/role";

const router = Router();

// only superadmin can manage roles/permissions
router.use(requireAuth, permit("superadmin"));

router.post("/", validateBody(createRoleSchema), rolesCtrl.createRole);
router.get("/", rolesCtrl.listRoles);
router.patch("/:id", validateBody(updateRoleSchema), rolesCtrl.updateRole);
router.delete("/:id", rolesCtrl.deleteRole);

export default router;