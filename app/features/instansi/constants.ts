import type { TableColumn } from "@nuxt/ui";
import z from "zod";
import { UBadge } from "#components";

export const columns: TableColumn<any>[] = [
  {
    accessorKey: "nama",
    header: "Nama Instansi",
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const color = {
        true: "success" as const,
        false: "info" as const,
      }[row.getValue("isActive") ? "true" : "false"];

      return h(UBadge, { class: "capitalize rounded-full", color }, () =>
        row.getValue("isActive") ? "Aktif" : "Tidak Aktif");
    },
  },
];

export const schema = z.object({
  id: z.optional(z.number()),
  nama: z.string().check(z.minLength(1, "Wajib diisi")),
  isActive: z.boolean(),
});

export function getInitialFormData(): Schema {
  return {
    id: undefined,
    nama: "",
    isActive: true,
  };
}

export type Schema = z.infer<typeof schema>;
