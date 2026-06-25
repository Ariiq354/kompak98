import provinsi from "~~/public/wilayah/provinces.json";
import { months } from "~~/shared/constant";
import { DashboardRepo } from "./repo";

export abstract class DashboardService {
  static async getDashboard() {
    const user = await DashboardRepo.getUserDashboard();
    const pemasukan = await DashboardRepo.getPemasukan();

    const totalUser = user.length;
    const totalLaki = user.filter(u => u.gender === "Laki-laki").length;
    const totalPerempuan = user.filter(u => u.gender === "Perempuan").length;

    const countProvinsi = user.map(u => u.provinsiKantor).reduce((acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const chartProvinsi = provinsi.map(p => ({
      provinsi: p.name,
      total: Math.floor(Math.random() * 10),
      // total: countProvinsi[p.id] || 0,
    }));

    const result = months.map((month, index) => {
      let total = 0;

      pemasukan.dataKhusus.forEach((item) => {
        if (item.tanggalBayar) {
          const m = new Date(item.tanggalBayar).getMonth();
          if (m === index)
            total += Number(item.total);
        }
      });

      pemasukan.dataBulanan.forEach((item) => {
        if (item.tanggalBayar) {
          const m = new Date(item.tanggalBayar).getMonth();
          if (m === index)
            total += Number(item.total);
        }
      });

      return {
        bulan: month,
        // pemasukan: total,
        pemasukan: Math.floor(Math.random() * 100000),
        pengeluaran: Math.floor(Math.random() * 100000),
      };
    });

    return {
      totalUser,
      totalLaki,
      totalPerempuan,
      chartProvinsi,
      chartPemasukan: result,
    };
  }
}
