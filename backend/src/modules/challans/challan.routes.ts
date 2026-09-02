import { Router } from "express";
import { create, getById, list, confirm, cancel } from "./challan.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { validate } from "../../middleware/validate.middleware";
import { createChallanSchema } from "./challan.schema";

const router = Router();

router.use(authenticate);

router.get("/", list);
router.get("/:id", getById);
router.post("/", requireRole("ADMIN", "SALES"), validate(createChallanSchema), create);
router.post("/:id/confirm", requireRole("ADMIN", "SALES"), confirm);
router.post("/:id/cancel", requireRole("ADMIN", "SALES"), cancel);

export default router;