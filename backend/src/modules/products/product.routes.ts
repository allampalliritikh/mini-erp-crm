import { Router } from "express";
import multer from "multer";
import { list, getById, create, update, uploadImage } from "./product.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { validate } from "../../middleware/validate.middleware";
import { createProductSchema, updateProductSchema } from "./product.schema";

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

router.use(authenticate);

router.get("/", list);
router.get("/:id", getById);
router.post("/", requireRole("ADMIN", "WAREHOUSE"), validate(createProductSchema), create);
router.put("/:id", requireRole("ADMIN", "WAREHOUSE"), validate(updateProductSchema), update);
router.post(
  "/:id/image",
  requireRole("ADMIN", "WAREHOUSE"),
  upload.single("image"),
  uploadImage
);

export default router;