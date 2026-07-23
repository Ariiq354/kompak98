import { z } from "zod";

export const KODE_JABATAN_OPTIONS = [
  "Account Representative",
  "Eselon 3",
  "Eselon 4",
  "Pelaksana",
  "Pemeriksa Pajak",
  "Penilai",
  "Penyuluh",
  "Pranata Komputer",
];

export interface QueryParams {
  page: number;
  search: string;
  limit: number;
  kodeJabatan?: string;
}

interface UserResponse {
  id: number;
  gender: "Laki-laki" | "Perempuan" | null;
  namaKantor: string | null;
  provinsiKantorId: number | null;
  noHp: string | null;
  nip18: string | null;
  idJabatan: number | null;
  namaJabatan: string | null;
  namaUnitEs4: string | null;
  namaPangkat: string | null;
  pendidikanFormal: string | null;
  alamat: string | null;
  provinsiId: number | null;
  kotaId: number | null;
  foto: string | null;
  name: string;
  nip9: string | null;
}

export const schema = z.object({
  gender: z.enum(["Laki-laki", "Perempuan"]).optional(),
  namaKantor: z.string().optional(),
  provinsiKantorId: z.number().optional(),
  noHp: z.string().optional(),
  nip18: z.string().optional(),
  idJabatan: z.number().optional(),
  namaUnitEs4: z.string().optional(),
  namaPangkat: z.string().optional(),
  pendidikanFormal: z.string().optional(),
  alamat: z.string().optional(),
  provinsiId: z.number().optional(),
  kotaId: z.number().optional(),
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
    gender: data?.gender ?? undefined,
    namaKantor: data?.namaKantor ?? undefined,
    provinsiKantorId: data?.provinsiKantorId ?? undefined,
    noHp: data?.noHp ?? undefined,
    nip18: data?.nip18 ?? undefined,
    idJabatan: data?.idJabatan ?? undefined,
    namaUnitEs4: data?.namaUnitEs4 ?? undefined,
    namaPangkat: data?.namaPangkat ?? undefined,
    pendidikanFormal: data?.pendidikanFormal ?? undefined,
    alamat: data?.alamat ?? undefined,
    provinsiId: data?.provinsiId ?? undefined,
    kotaId: data?.kotaId ?? undefined,
    foto: data?.foto ?? undefined,
  };
}

export type Schema = z.infer<typeof schema>;
