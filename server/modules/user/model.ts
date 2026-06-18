import { z } from "zod";

export const updateUserSchema = z.object({
  namaKantor: z.string().min(1).optional(),
  noHp: z.string().min(1).optional(),
  nip18: z.string().min(1).optional(),
  namaJabatan: z.string().min(1).optional(),
  namaUnitEs4: z.string().min(1).optional(),
  namaPangkat: z.string().min(1).optional(),
  pendidikanFormal: z.string().min(1).optional(),
  alamat: z.string().min(1).optional(),
  rt: z.string().min(1).optional(),
  rw: z.string().min(1).optional(),
});

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
