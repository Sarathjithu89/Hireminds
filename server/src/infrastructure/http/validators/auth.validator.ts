import { email, z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.email(),
  password: z.string().min(8, "Password must be atleast 8 characters").max(100),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});
