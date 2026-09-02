import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  sku: z.string().min(1, "SKU is required"),
  category: z.string().optional(),
  unitPrice: z.number().positive("Unit price must be positive"),
  stock: z.number().int().nonnegative().optional(),
  minStock: z.number().int().nonnegative().optional(),
  location: z.string().optional(),
});

export const updateProductSchema = createProductSchema.partial();