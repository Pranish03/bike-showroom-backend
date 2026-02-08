// To do validation
import { z } from "zod";

export const createBikeValidationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.string().min(1, "Price is required"),
  companyName: z.string().min(1, "Company name is required"),
  details: z.string().optional(),
});

export const updateBikeValidationSchema = createBikeValidationSchema.partial();
