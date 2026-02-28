import { z } from "zod";

export const contactValidationSchema = z.object({
  name: z.string().min(3, "Name must have atleast 3 characters").trim(),
  email: z.email("Invalid email address").trim(),
  subject: z.string().min(1, "Subject is required").trim(),
  message: z.string().min(5, "Message must have atleast 5 characters").trim(),
});
