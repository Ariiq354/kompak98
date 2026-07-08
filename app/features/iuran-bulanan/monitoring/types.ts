import type { PageSearch } from "~/utils/types";

export interface QueryParam extends PageSearch {
  tahun: number;
  filter?: "belum_bayar" | "belum_komplit" | "komplit";
}
