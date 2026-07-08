import { z } from "zod";
import { paginationSearchSchema } from "~~/server/utils/schema";

const createPertanyaanSchema = z.object({
  pertanyaan: z.string().min(1, "Teks pertanyaan tidak boleh kosong"),
  wajib: z.boolean().default(false),
  nomorUrut: z.number().int().nonnegative(),
});

export const createSurveiSchema = z.object({
  judul: z.string().min(1, "Judul survei tidak boleh kosong"),
  deskripsi: z.string().optional(),
  pertanyaan: z.array(createPertanyaanSchema).min(1, "Minimal harus ada 1 pertanyaan"),
});

export type CreateSurveiSchema = z.infer<typeof createSurveiSchema>;

export const updateSurveiSchema = z.object({
  judul: z.string().min(1, "Judul survei tidak boleh kosong").optional(),
  deskripsi: z.string().optional(),
});

export type UpdateSurveiSchema = z.infer<typeof updateSurveiSchema>;

export const getSurveiSchema = paginationSearchSchema;

export type GetSurveiSchema = z.infer<typeof getSurveiSchema>;

const submitJawabanSchema = z.object({
  pertanyaanId: z.number().int(),
  jawaban: z.string().min(1, "Jawaban tidak boleh kosong"),
});

export const submitResponSchema = z.object({
  jawaban: z.array(submitJawabanSchema).min(1, "Minimal harus ada 1 jawaban"),
});

export type SubmitResponSchema = z.infer<typeof submitResponSchema>;
