import { Router } from "express";
import { list, getById, create, update, addNote } from "./customer.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";
import { validate } from "../../middleware/validate.middleware";
import {
  createCustomerSchema,
  updateCustomerSchema,
  addNoteSchema,
} from "./customer.schema";

const router = Router();

router.use(authenticate);

router.get("/", list);
router.get("/:id", getById);
router.post("/", requireRole("ADMIN", "SALES"), validate(createCustomerSchema), create);
router.put("/:id", requireRole("ADMIN", "SALES"), validate(updateCustomerSchema), update);
router.post("/:id/notes", requireRole("ADMIN", "SALES"), validate(addNoteSchema), addNote);

export default router;