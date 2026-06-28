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
