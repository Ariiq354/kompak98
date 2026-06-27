export interface QueryParam extends PageSearch {
  tahun: number;
  filter?: "belum_bayar" | "belum_komplit" | "komplit";
}
