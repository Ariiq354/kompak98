import { z } from "zod";
import { paginationSearchSchema } from "~~/server/utils/schema";

const createPertanyaanSchema = z.object({
  tipe: z.enum(["short_text", "long_text", "single_choice", "multiple_choice", "dropdown", "rating"]),
  pertanyaan: z.string().min(1, "Teks pertanyaan tidak boleh kosong"),
  wajib: z.boolean().default(false),
  nomorUrut: z.number().int().nonnegative(),
  pilihan: z.array(z.string()).optional().nullable(),
});

export const createSurveiSchema = z.object({
  judul: z.string().min(1, "Judul survei tidak boleh kosong"),
  deskripsi: z.string().optional().nullable(),
  headerGambar: z.string().optional().nullable(),
  status: z.enum(["draft", "published"]).default("draft"),
  tanggalMulai: z.string().optional().nullable(),
  tanggalSelesai: z.string().optional().nullable(),
  pertanyaan: z.array(createPertanyaanSchema).min(1, "Minimal harus ada 1 pertanyaan"),
});

export type CreateSurveiSchema = z.infer<typeof createSurveiSchema>;

export const updateSurveiSchema = z.object({
  judul: z.string().min(1, "Judul survei tidak boleh kosong").optional(),
  deskripsi: z.string().optional().nullable(),
  headerGambar: z.string().optional().nullable(),
  status: z.enum(["draft", "published"]).optional(),
  tanggalMulai: z.string().optional().nullable(),
  tanggalSelesai: z.string().optional().nullable(),
});

export type UpdateSurveiSchema = z.infer<typeof updateSurveiSchema>;

export const getSurveiSchema = paginationSearchSchema.extend({
  status: z.enum(["draft", "published"]).optional(),
});

export type GetSurveiSchema = z.infer<typeof getSurveiSchema>;

const submitJawabanSchema = z.object({
  pertanyaanId: z.number().int(),
  jawaban: z.union([
    z.string(),
    z.number(),
    z.array(z.string()),
  ]),
});

export const submitResponSchema = z.object({
  jawaban: z.array(submitJawabanSchema).min(1, "Minimal harus ada 1 jawaban"),
});

export type SubmitResponSchema = z.infer<typeof submitResponSchema>;
