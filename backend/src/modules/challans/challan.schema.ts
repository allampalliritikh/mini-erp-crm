import { z } from "zod";

export const createChallanSchema = z.object({
  customerId: z.string().uuid("Valid customerId is required"),
  items: z
    .array(
      z.object({
        productId: z.string().uuid("Valid productId is required"),
        quantity: z.number().int().positive("Quantity must be positive"),
      })
    )
    .min(1, "At least one item is required"),
});