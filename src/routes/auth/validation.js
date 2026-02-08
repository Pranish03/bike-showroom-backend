import z from "zod";

export const SignupValidationSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  username: z.string().optional(),
});

export const LoginValidationSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});
