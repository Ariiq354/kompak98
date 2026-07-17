import { and, eq, sql } from "drizzle-orm";
import { db } from "~~/server/database";
import { userTable } from "~~/server/database/schema/auth";
import { pembayaranIuranKhususTable, pembayaranKasBulananTable } from "~~/server/database/schema/iuran";
import { jabatanTable } from "~~/server/database/schema/jabatan";
import { pengeluaranTable } from "~~/server/database/schema/pengeluaran";
import { userProfileTable } from "~~/server/database/schema/user";

export abstract class DashboardRepo {
  static async getUserSummary() {
    const [result] = await db.select({
      totalUser: sql<number>`count(${userTable.id})`.mapWith(Number),
      maleUser: sql<number>`count(case when ${userProfileTable.gender} = 'Laki-laki' then 1 end)`.mapWith(Number),
      femaleUser: sql<number>`count(case when ${userProfileTable.gender} = 'Perempuan' then 1 end)`.mapWith(Number),
    })
      .from(userTable)
      .leftJoin(userProfileTable, eq(userTable.id, userProfileTable.userId));
    return result || { totalUser: 0, maleUser: 0, femaleUser: 0 };
  }

  static async getJabatanSummary() {
    return await db.select({
      jenisJabatan: jabatanTable.jenisJabatan,
      kodeJabatan: jabatanTable.kodeJabatan,
      count: sql<number>`count(${userTable.id})`.mapWith(Number),
    })
      .from(userTable)
      .leftJoin(userProfileTable, eq(userTable.id, userProfileTable.userId))
      .leftJoin(jabatanTable, eq(userProfileTable.idJabatan, jabatanTable.id))
      .groupBy(jabatanTable.jenisJabatan, jabatanTable.kodeJabatan);
  }

  static async getProvinsiKantorSummary() {
    return await db.select({
      provinsiKantorId: userProfileTable.provinsiKantorId,
      count: sql<number>`count(${userTable.id})`.mapWith(Number),
    })
      .from(userTable)
      .leftJoin(userProfileTable, eq(userTable.id, userProfileTable.userId))
      .groupBy(userProfileTable.provinsiKantorId);
  }

  static async getProvinsiSummary() {
    return await db.select({
      provinsi: userProfileTable.provinsiId,
      count: sql<number>`count(${userTable.id})`.mapWith(Number),
    })
      .from(userTable)
      .leftJoin(userProfileTable, eq(userTable.id, userProfileTable.userId))
      .groupBy(userProfileTable.provinsiId);
  }

  static async getPemasukanBulananPerBulan(currentYear: number) {
    return await db.select({
      month: sql<number>`extract(month from ${pembayaranKasBulananTable.tanggalBayar})`.mapWith(Number),
      total: sql<number>`sum(${pembayaranKasBulananTable.nominal})`.mapWith(Number),
    })
      .from(pembayaranKasBulananTable)
      .where(
        and(
          sql`extract(year from ${pembayaranKasBulananTable.tanggalBayar}) = ${currentYear}`,
          eq(pembayaranKasBulananTable.status, "lunas"),
        ),
      )
      .groupBy(sql`extract(month from ${pembayaranKasBulananTable.tanggalBayar})`);
  }

  static async getPemasukanKhususPerBulan(currentYear: number) {
    return await db.select({
      month: sql<number>`extract(month from ${pembayaranIuranKhususTable.tanggalBayar})`.mapWith(Number),
      total: sql<number>`sum(${pembayaranIuranKhususTable.nominal})`.mapWith(Number),
    })
      .from(pembayaranIuranKhususTable)
      .where(
        and(
          sql`extract(year from ${pembayaranIuranKhususTable.tanggalBayar}) = ${currentYear}`,
          eq(pembayaranIuranKhususTable.status, "lunas"),
        ),
      )
      .groupBy(sql`extract(month from ${pembayaranIuranKhususTable.tanggalBayar})`);
  }

  static async getPengeluaranPerBulan(currentYear: number) {
    return await db.select({
      month: sql<number>`extract(month from ${pengeluaranTable.tanggal})`.mapWith(Number),
      total: sql<number>`sum(${pengeluaranTable.nominal})`.mapWith(Number),
    })
      .from(pengeluaranTable)
      .where(
        sql`extract(year from ${pengeluaranTable.tanggal}) = ${currentYear}`,
      )
      .groupBy(sql`extract(month from ${pengeluaranTable.tanggal})`);
  }
}
