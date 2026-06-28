import { and, eq, isNotNull, sql } from "drizzle-orm";
import { db } from "~~/server/database";
import { userTable } from "~~/server/database/schema/auth";
import { pembayaranIuranKhususTable, pembayaranKasBulananTable } from "~~/server/database/schema/iuran";
import { jabatanTable } from "~~/server/database/schema/jabatan";
import { pengeluaranTable } from "~~/server/database/schema/pengeluaran";
import { userProfileTable } from "~~/server/database/schema/user";

export abstract class DashboardRepo {
  static async getUserDashboard() {
    const data = await db.select({
      id: userTable.id,
      gender: userProfileTable.gender,
      provinsiKantor: userProfileTable.provinsiKantor,
      provinsi: userProfileTable.provinsi,
      jabatan: jabatanTable.jabatan,
      kodeJabatan: jabatanTable.kodeJabatan,
      jenisJabatan: jabatanTable.jenisJabatan,
    })
      .from(userTable)
      .innerJoin(userProfileTable, eq(userTable.id, userProfileTable.userId))
      .innerJoin(jabatanTable, eq(userProfileTable.idJabatan, jabatanTable.id))
      .where(and(isNotNull(userProfileTable.gender), isNotNull(userProfileTable.provinsiKantor)));

    const result = data.map(item => ({
      id: item.id,
      gender: item.gender!,
      provinsiKantor: item.provinsiKantor!,
      provinsi: item.provinsi!,
      jabatan: item.jabatan,
      kodeJabatan: item.kodeJabatan,
      jenisJabatan: item.jenisJabatan,
    }));

    return result;
  }

  static async getPemasukan() {
    const currentYear = new Date().getFullYear();

    const dataKhusus = await db.select({
      total: sql<number>`coalesce(sum(${pembayaranIuranKhususTable.nominal}), 0)`,
      tanggalBayar: pembayaranIuranKhususTable.tanggalBayar,
    })
      .from(pembayaranIuranKhususTable)
      .where(
        sql`extract(year from ${pembayaranIuranKhususTable.tanggalBayar}) = ${currentYear}
        and ${pembayaranIuranKhususTable.status} = 'lunas'`,
      )
      .groupBy(pembayaranIuranKhususTable.tanggalBayar);

    const dataBulanan = await db.select({
      total: sql<number>`coalesce(sum(${pembayaranKasBulananTable.nominal}), 0)`,
      tanggalBayar: pembayaranKasBulananTable.tanggalBayar,
    })
      .from(pembayaranKasBulananTable)
      .where(
        sql`extract(year from ${pembayaranKasBulananTable.tanggalBayar}) = ${currentYear}
        and ${pembayaranKasBulananTable.status} = 'lunas'`,
      )
      .groupBy(pembayaranKasBulananTable.tanggalBayar);

    return {
      dataKhusus: dataKhusus.map(item => ({ total: item.total, tanggalBayar: item.tanggalBayar! })),
      dataBulanan: dataBulanan.map(item => ({ total: item.total, tanggalBayar: item.tanggalBayar! })),
    };
  }

  static async getPengeluaran() {
    const currentYear = new Date().getFullYear();

    const data = await db.select({
      total: sql<number>`coalesce(sum(${pengeluaranTable.nominal}), 0)`,
      tanggal: pengeluaranTable.tanggal,
    })
      .from(pengeluaranTable)
      .where(
        sql`extract(year from ${pengeluaranTable.tanggal}) = ${currentYear}`,
      )
      .groupBy(pengeluaranTable.tanggal);

    return {
      data,
    };
  }
}
