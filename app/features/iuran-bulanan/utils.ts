export function getAvailMonths(
  bulan: {
    bulan: number;
    status: "pending" | "menunggu_verifikasi" | "lunas";
  }[],
) {
  const paidMonths = bulan.map(item => item.bulan);

  return Array.from({ length: 12 }, (_, index) => index + 1)
    .filter(month => !paidMonths.includes(month));
}
