import type { TableColumn } from "@nuxt/ui";
import type { PageSearch } from "~/utils/types";
import z from "zod";
import { formatDateIndo } from "~/utils";

export interface QueryParams extends PageSearch {
  limit?: number;
}

export const columns: TableColumn<any>[] = [
  { accessorKey: "judul", header: "Judul Survei" },
  { accessorKey: "deskripsi", header: "Deskripsi" },
  {
    accessorKey: "createdAt",
    header: "Tanggal Dibuat",
    cell: ({ row }) => formatDateIndo(row.original.createdAt),
  },
];

export const schema = z.object({
  id: z.number().optional(),
  judul: z.string().min(1, "Judul survei tidak boleh kosong!"),
  deskripsi: z.string().optional(),
  pertanyaan: z.array(z.object({
    id: z.number().optional(),
    pertanyaan: z.string().min(1, "Teks pertanyaan tidak boleh kosong!"),
    wajib: z.boolean().default(false),
    nomorUrut: z.number().int().nonnegative(),
  })).optional(),
});

export type Schema = z.infer<typeof schema>;

export const initFormData: Partial<Schema> = {
  id: undefined,
  judul: "",
  deskripsi: "",
  pertanyaan: [],
};

export interface JawabanState {
  pertanyaanId: number;
  pertanyaanText: string;
  wajib: boolean;
  jawaban: string;
}
