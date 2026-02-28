import { z } from "zod";

export const SignupValidationSchema = z.object({
  name: z.string().min(3, "Name must have atleast 3 characters").trim(),
  email: z.email("Invalid email address").trim(),
  password: z.string().min(8, "Password must have atleast 8 characters").trim(),
});

export const LoginValidationSchema = z.object({
  email: z.email("Invalid email address").trim(),
  password: z.string().min(8, "Password must have ateast 8 characters").trim(),
});
