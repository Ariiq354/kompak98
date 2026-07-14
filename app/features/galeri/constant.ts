import type { PageSearch } from "~/utils/types";

export interface QueryParams extends PageSearch {
  tahun?: number;
  bulan?: number;
}
