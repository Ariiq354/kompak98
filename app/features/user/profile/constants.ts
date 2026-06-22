import { z } from "zod";

interface UserResponse {
  namaKantor: string | null;
  noHp: string | null;
  nip18: string | null;
  namaJabatan: string | null;
  namaUnitEs4: string | null;
  namaPangkat: string | null;
  pendidikanFormal: string | null;
  alamat: string | null;
  rt: string | null;
  rw: string | null;
  foto: string | null;
  id: number;
  name: string;
  nip9: string | null;
}

export const schema = z.object({
  namaKantor: z.string().optional(),
  noHp: z.string().optional(),
  nip18: z.string().optional(),
  namaJabatan: z.string().optional(),
  namaUnitEs4: z.string().optional(),
  namaPangkat: z.string().optional(),
  pendidikanFormal: z.string().optional(),
  alamat: z.string().optional(),
  rt: z.string().optional(),
  rw: z.string().optional(),
  foto: z.string().optional(),
  file: z.optional(
    z
      .file()
      .check(
        z.maxSize(5_000_000),
        z.mime(["image/png", "image/jpeg", "image/webp"]),
      ),
  ),
});

export function initFormData(data?: UserResponse): Schema {
  return {
    namaKantor: data?.namaKantor ?? "",
    noHp: data?.noHp ?? "",
    nip18: data?.nip18 ?? "",
    namaJabatan: data?.namaJabatan ?? "",
    namaUnitEs4: data?.namaUnitEs4 ?? "",
    namaPangkat: data?.namaPangkat ?? "",
    pendidikanFormal: data?.pendidikanFormal ?? "",
    alamat: data?.alamat ?? "",
    rt: data?.rt ?? "",
    rw: data?.rw ?? "",
    foto: data?.foto ?? "",
  };
}

export type Schema = z.infer<typeof schema>;
