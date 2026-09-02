import { Router } from "express";
import { list, getById, create, update } from "./product.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { validate } from "../../middleware/validate.middleware";
import { createProductSchema, updateProductSchema } from "./product.schema";

const router = Router();

router.use(authenticate);

router.get("/", list);
router.get("/:id", getById);
router.post("/", requireRole("ADMIN", "WAREHOUSE"), validate(createProductSchema), create);
router.put("/:id", requireRole("ADMIN", "WAREHOUSE"), validate(updateProductSchema), update);

export default router;