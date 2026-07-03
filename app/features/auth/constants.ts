import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Wajib diisi"),
  password: z.string().min(1, "Wajib diisi"),
  rememberMe: z.boolean(),
});

export const initFormDataLogin: LoginSchema = {
  username: "",
  password: "",
  rememberMe: false,
};

export type LoginSchema = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  username: z.string().min(1, "Wajib diisi"),
  name: z.string().min(1, "Wajib diisi"),
  password: z.string().min(8, "Jumlah karakter wajib ada 8"),
});

export const initFormDataRegister: RegisterSchema = {
  username: "",
  name: "",
  password: "",
};

export type RegisterSchema = z.infer<typeof registerSchema>;
