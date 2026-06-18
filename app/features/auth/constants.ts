import { z } from "zod";

export const loginSchema = z.object({
  nip: z.string().min(1, "Wajib diisi"),
  password: z.string().min(1, "Wajib diisi"),
  rememberMe: z.boolean(),
});

export const initFormDataLogin: LoginSchema = {
  nip: "",
  password: "",
  rememberMe: false,
};

export type LoginSchema = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  nip: z.string().min(9, "Jumlah karakter wajib ada 9"),
  name: z.string().min(1, "Wajib diisi"),
  password: z.string().min(7, "Jumlah karakter wajib ada 7"),
});

export const initFormDataRegister: RegisterSchema = {
  nip: "",
  name: "",
  password: "",
};

export type RegisterSchema = z.infer<typeof registerSchema>;
