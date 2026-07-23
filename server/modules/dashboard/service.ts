import { WilayahRepo } from "~~/server/modules/wilayah/repo";
import { months } from "~~/shared/constant";
import { DashboardRepo } from "./repo";

export abstract class DashboardService {
  static async getDashboard() {
    const [
      userSummary,
      jabatanSummary,
      provinsiKantorSummary,
      provinsiSummary,
      provinsiList,
    ] = await Promise.all([
      DashboardRepo.getUserSummary(),
      DashboardRepo.getJabatanSummary(),
      DashboardRepo.getProvinsiKantorSummary(),
      DashboardRepo.getProvinsiSummary(),
      WilayahRepo.findProvincies(),
    ]);

    const summary = {
      user: {
        totalUser: userSummary.totalUser,
        byGender: {
          "Laki-laki": userSummary.maleUser,
          "Perempuan": userSummary.femaleUser,
        },
      },
      PejabatStruktural: {
        total: 0,
        byKodeJabatan: {} as Record<string, number>,
      },
      PejabatFungsional: {
        total: 0,
        byKodeJabatan: {} as Record<string, number>,
      },
      Pelaksana: {
        total: 0,
        byKodeJabatan: {
          "Penelaah Keberatan": 0,
        } as Record<string, number>,
      },
    };

    for (const item of jabatanSummary) {
      if (!item.jenisJabatan)
        continue;
      const jenis = item.jenisJabatan.toLowerCase();
      const kode = item.kodeJabatan;
      if (!kode)
        continue;

      if (jenis === "pejabat struktural") {
        summary.PejabatStruktural.total += item.count;
        summary.PejabatStruktural.byKodeJabatan[kode] = item.count;
      }
      else if (jenis === "pejabat fungsional") {
        summary.PejabatFungsional.total += item.count;
        summary.PejabatFungsional.byKodeJabatan[kode] = item.count;
      }
      else if (jenis === "pelaksana") {
        summary.Pelaksana.total += item.count;
        summary.Pelaksana.byKodeJabatan[kode] = item.count;
      }
    }

    const countProvinsiKantor: Record<string, number> = {};
    for (const item of provinsiKantorSummary) {
      if (item.provinsiKantorId) {
        countProvinsiKantor[item.provinsiKantorId] = item.count;
      }
    }

    const chartProvinsiKantor = provinsiList.map(p => ({
      provinsi: p.provinsi,
      total: countProvinsiKantor[p.id] || 0,
    }));

    const countProvinsi: Record<string, number> = {};
    for (const item of provinsiSummary) {
      if (item.provinsi) {
        countProvinsi[item.provinsi] = item.count;
      }
    }

    const chartProvinsi = provinsiList.map(p => ({
      provinsi: p.provinsi,
      total: countProvinsi[p.id] || 0,
    }));

    return {
      summary,
      chartProvinsiKantor,
      chartProvinsi,
    };
  }

  static async getDashboardTransaksi() {
    const currentYear = new Date().getFullYear();
    const bulanan = await DashboardRepo.getPemasukanBulananPerBulan(currentYear);
    const khusus = await DashboardRepo.getPemasukanKhususPerBulan(currentYear);
    const pengeluaran = await DashboardRepo.getPengeluaranPerBulan(currentYear);

    const bulananMap = new Map(bulanan.map(item => [item.month, item.total]));
    const khususMap = new Map(khusus.map(item => [item.month, item.total]));
    const pengeluaranMap = new Map(pengeluaran.map(item => [item.month, item.total]));

    const result = months.map((month, index) => {
      const monthNum = index + 1;
      const totalBulanan = bulananMap.get(monthNum) || 0;
      const totalKhusus = khususMap.get(monthNum) || 0;
      const totalPemasukan = totalBulanan + totalKhusus;
      const totalPengeluaran = pengeluaranMap.get(monthNum) || 0;

      return {
        bulan: month,
        pengeluaran: totalPengeluaran,
        pemasukan: totalPemasukan,
      };
    });

    return result;
  }
}
