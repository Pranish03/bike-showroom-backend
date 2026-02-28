import z from "zod";

export const SignupValidationSchema = z.object({
  name: z.string().optional(),
  email: z.email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const LoginValidationSchema = z.object({
  email: z.email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
