import { z } from "zod";

export const createBikeValidationSchema = z.object({
  name: z.string().min(2, "Name must have atleast 2 characters").trim(),
  description: z
    .string()
    .min(10, "Description must have atleast 10 characters")
    .trim(),
  price: z.string().min(1, "Price is required").trim(),
  brand: z.string().min(2, "Brand must have atleast 2 characters").trim(),
  details: z.string().optional(),
});

export const updateBikeValidationSchema = createBikeValidationSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });
