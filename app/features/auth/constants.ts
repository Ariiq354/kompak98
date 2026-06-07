import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Email tidak valid").min(1, "Wajib diisi"),
  password: z.string().min(1, "Wajib diisi"),
  rememberMe: z.boolean(),
});

export const initFormDataLogin: LoginSchema = {
  email: "",
  password: "",
  rememberMe: false,
};

export type LoginSchema = z.infer<typeof loginSchema>;
