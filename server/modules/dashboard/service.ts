import provinsi from "~~/public/wilayah/provinces.json";
import { months } from "~~/shared/constant";
import { DashboardRepo } from "./repo";

export abstract class DashboardService {
  static async getDashboard() {
    const users = await DashboardRepo.getUserDashboard();

    const summary = {
      user: {
        totalUser: 0,
        byGender: {
          "Laki-laki": 0,
          "Perempuan": 0,
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
        byKodeJabatan: {} as Record<string, number>,
      },
    };

    for (const u of users) {
      summary.user.totalUser++;
      if (u.gender === "Laki-laki") {
        summary.user.byGender["Laki-laki"]++;
      }
      else if (u.gender === "Perempuan") {
        summary.user.byGender.Perempuan++;
      }

      const jenis = u.jenisJabatan.toLowerCase();
      const kode = u.kodeJabatan;

      if (jenis === "pejabat struktural") {
        summary.PejabatStruktural.total++;
        summary.PejabatStruktural.byKodeJabatan[kode] = (summary.PejabatStruktural.byKodeJabatan[kode] || 0) + 1;
      }
      else if (jenis === "pejabat fungsional") {
        summary.PejabatFungsional.total++;
        summary.PejabatFungsional.byKodeJabatan[kode] = (summary.PejabatFungsional.byKodeJabatan[kode] || 0) + 1;
      }
      else if (jenis === "pelaksana") {
        summary.Pelaksana.total++;
        summary.Pelaksana.byKodeJabatan[kode] = (summary.Pelaksana.byKodeJabatan[kode] || 0) + 1;
      }
    }

    const countProvinsiKantor = users.map(u => u.provinsiKantor).reduce((acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const chartProvinsiKantor = provinsi.map(p => ({
      provinsi: p.name,
      total: Math.floor(Math.random() * 10),
      // total: countProvinsiKantor[p.id] || 0,
    }));

    const countProvinsi = users.map(u => u.provinsiKantor).reduce((acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const chartProvinsi = provinsi.map(p => ({
      provinsi: p.name,
      total: Math.floor(Math.random() * 10),
      // total: countProvinsi[p.id] || 0,
    }));

    return {
      summary,
      chartProvinsiKantor,
      chartProvinsi,
    };
  }

  static async getDashboardTransaksi() {
    const pemasukan = await DashboardRepo.getPemasukan();
    const pengeluaran = await DashboardRepo.getPengeluaran();

    const result = months.map((month, index) => {
      let totalPemasukan = 0;
      let totalPengeluaran = 0;

      pemasukan.dataKhusus.forEach((item) => {
        if (item.tanggalBayar) {
          const m = new Date(item.tanggalBayar).getMonth();
          if (m === index)
            totalPemasukan += Number(item.total);
        }
      });

      pemasukan.dataBulanan.forEach((item) => {
        if (item.tanggalBayar) {
          const m = new Date(item.tanggalBayar).getMonth();
          if (m === index)
            totalPemasukan += Number(item.total);
        }
      });

      pengeluaran.data.forEach((item) => {
        if (item.tanggal) {
          const m = new Date(item.tanggal).getMonth();
          if (m === index)
            totalPengeluaran += Number(item.total);
        }
      });

      return {
        bulan: month,
        // pengeluaran: totalPengeluaran,
        // pemasukan: totalPemasukan,
        pemasukan: Math.floor(Math.random() * 100000),
        pengeluaran: Math.floor(Math.random() * 100000),
      };
    });

    return result;
  }
}
