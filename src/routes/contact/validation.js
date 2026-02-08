import { z } from "zod";

export const contactValidationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email(),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(5, "Message must be at least 5 characters"),
});
