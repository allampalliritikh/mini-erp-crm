import { z } from "zod";

export const createCustomerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  mobile: z.string().min(10, "Valid mobile number is required"),
  email: z.string().email().optional(),
  businessName: z.string().optional(),
  gstNumber: z.string().optional(),
  customerType: z.enum(["RETAIL", "WHOLESALE", "DISTRIBUTOR"]),
  address: z.string().optional(),
  status: z.enum(["LEAD", "ACTIVE", "INACTIVE"]).optional(),
  followUpDate: z.string().datetime().optional(),
});

export const updateCustomerSchema = createCustomerSchema.partial();

export const addNoteSchema = z.object({
  note: z.string().min(1, "Note cannot be empty"),
});