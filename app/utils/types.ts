export interface PageSearch {
  page?: number;
  search?: string;
}

export type ExtractFetchData<T>
  = T extends Ref<{ data: infer D } | undefined>
    ? D
    : never;

export type StatusTagihan = "pending" | "menunggu_verifikasi" | "lunas";

export const LABEL_STATUS_BAYAR: Record<
  "pending" | "menunggu_verifikasi" | "lunas",
  {
    label: string;
    color: "warning" | "primary" | "success";
  }
> = {
  pending: {
    label: "Menunggu Pembayaran",
    color: "warning",
  },
  menunggu_verifikasi: {
    label: "Menunggu Verifikasi",
    color: "primary",
  },
  lunas: {
    label: "Lunas",
    color: "success",
  },
};
