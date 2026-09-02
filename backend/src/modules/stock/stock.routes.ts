import { Router } from "express";
import { list, adjust } from "./stock.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";

const router = Router();

router.use(authenticate);

router.get("/logs", list);
router.post("/adjust", requireRole("ADMIN", "WAREHOUSE"), adjust);

export default router;