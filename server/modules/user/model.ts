import { z } from "zod";
import { multipartFile, paginationSearchSchema } from "~~/server/utils/schema";

export const updateUserSchema = z.object({
  gender: z.enum(["Laki-laki", "Perempuan"]).optional(),
  namaKantor: z.string().optional(),
  provinsiKantor: z.string().optional(),
  noHp: z.string().optional(),
  nip18: z.string().optional(),
  idJabatan: z.coerce.number().optional(),
  namaUnitEs4: z.string().optional(),
  namaPangkat: z.string().optional(),
  pendidikanFormal: z.string().optional(),
  alamat: z.string().optional(),
  provinsi: z.string().optional(),
  kota: z.string().optional(),
  file: multipartFile({
    maxSize: 5 * 1024 * 1024,
    fileTypes: ["image/jpeg", "image/png", "image/webp"],
  }).optional(),
  foto: z.string().optional(),
});

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;

export const getMonitoringUserSchema = z.object({
  ...paginationSearchSchema.shape,
  kodeJabatan: z.string().optional(),
});

export type GetMonitoringUserSchema = z.infer<typeof getMonitoringUserSchema>;

export const importUserCsvSchema = z.object({
  file: multipartFile({
    maxSize: 5 * 1024 * 1024,
    fileTypes: ["text/csv", "application/vnd.ms-excel"],
  }),
});

const nullableCsvString = z.preprocess(
  value => typeof value === "string" && value.trim() === "" ? null : value,
  z.string().trim().nullable(),
);

const nullableCsvNumber = z.preprocess(
  value => typeof value === "string" && value.trim() === "" ? null : value,
  z.coerce.number().int().positive().nullable(),
);

export const importUserRowSchema = z.object({
  id: z.coerce.number().int().positive(),
  Nama: z.string().trim().min(1),
  gender: z.preprocess(
    value => typeof value === "string" && value.trim() === "" ? null : value,
    z.enum(["Laki-laki", "Perempuan"]).nullable(),
  ),
  nip9: nullableCsvString,
  nip18: nullableCsvString,
  namaKantor: nullableCsvString,
  provinsiKantor: nullableCsvString,
  noHp: nullableCsvString,
  idJabatan: nullableCsvNumber,
  namaUnitEs4: nullableCsvString,
  namaPangkat: nullableCsvString,
  pendidikanFormal: nullableCsvString,
  alamat: nullableCsvString,
  provinsi: nullableCsvString,
  kota: nullableCsvString,
}).transform(({ Nama, ...data }) => ({
  ...data,
  name: Nama,
}));

export type ImportUserRow = z.infer<typeof importUserRowSchema>;
