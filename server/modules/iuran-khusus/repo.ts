import type { SQL } from "drizzle-orm";
import type { PaginationSearchSchema } from "~~/server/utils/schema";
import type { CreateIuranKhususSchema, CreatePembayaranKhususSchema, UpdateIuranKhususSchema } from "./model";
import { isAfter, parseISO, startOfDay } from "date-fns";
import { and, desc, eq, ilike, inArray, or, sql } from "drizzle-orm";
import { db } from "~~/server/database";
import { userTable } from "~~/server/database/schema/auth";
import { iuranKhususTable, pembayaranIuranKhususTable } from "~~/server/database/schema/iuran";
import { pengeluaranTable } from "~~/server/database/schema/pengeluaran";
import { getUniqueNominal } from "~~/server/utils/generator";

export abstract class IuranKhususRepo {
  static async createIuranKhusus(payload: CreateIuranKhususSchema) {
    return await db
      .insert(iuranKhususTable)
      .values({
        judul: payload.judul,
        deskripsi: payload.deskripsi,
        nominalAnjuran: payload.nominalAnjuran,
        tanggalAkhir: payload.tanggalAkhir || null,
      });
  }

  static async updateIuranKhusus(id: number, payload: UpdateIuranKhususSchema) {
    return await db
      .update(iuranKhususTable)
      .set({
        judul: payload.judul,
        deskripsi: payload.deskripsi,
        nominalAnjuran: payload.nominalAnjuran,
        tanggalAkhir: payload.tanggalAkhir || null,
      })
      .where(eq(iuranKhususTable.id, id));
  }

  static async deleteIuranKhusus(ids: number[]) {
    return await db
      .delete(iuranKhususTable)
      .where(inArray(iuranKhususTable.id, ids));
  }

  static async checkIuranTanggalAkhir(iuranId: number): Promise<boolean> {
    const iuranKhusus = await db
      .select({
        tanggalAkhir: iuranKhususTable.tanggalAkhir,
      })
      .from(iuranKhususTable)
      .where(
        eq(iuranKhususTable.id, iuranId),
      );

    if (!iuranKhusus.length) {
      return false;
    }

    const tanggalAkhirStr = iuranKhusus[0]!.tanggalAkhir;

    if (!tanggalAkhirStr) {
      return true;
    }

    const tanggalAkhir = startOfDay(parseISO(tanggalAkhirStr));
    const hariIni = startOfDay(new Date());

    return !isAfter(hariIni, tanggalAkhir);
  }

  static async pembayaranIuranKhusus(userId: number, payload: CreatePembayaranKhususSchema) {
    return await db.transaction(async (tx) => {
      const nominal = await getUniqueNominal(
        payload.nominal,
        pembayaranIuranKhususTable,
        pembayaranIuranKhususTable.nominal,
        pembayaranIuranKhususTable.status,
      );
      const [pembayaran] = await tx.insert(pembayaranIuranKhususTable).values({
        iuranId: payload.iuranId,
        nominal,
        userId,
        status: "pending",
      }).returning();

      if (!pembayaran) {
        throw new Error("Failed to create pembayaran iuran khusus");
      }

      return {
        pembayaranId: pembayaran.id,
        nominal,
      };
    });
  }

  static async updateStatusPembayaranKhusus(
    id: number,
    status: "pending" | "menunggu_verifikasi" | "lunas",
    tanggalBayar?: string,
  ) {
    return await db.update(pembayaranIuranKhususTable)
      .set({ status, tanggalBayar })
      .where(eq(pembayaranIuranKhususTable.id, id))
      .returning();
  }

  static async getPembayaranById(id: number) {
    const [pembayaran] = await db
      .select()
      .from(pembayaranIuranKhususTable)
      .where(eq(pembayaranIuranKhususTable.id, id))
      .limit(1);
    return pembayaran;
  }

  static async getIuranKhususNominal(query: PaginationSearchSchema) {
    const conditions: (SQL<unknown> | undefined)[] = [];

    if (query.search) {
      const searchCondition = `%${query.search}%`;
      conditions.push(or(ilike(iuranKhususTable.judul, searchCondition)));
    }

    const pembayaranSub = db
      .select({
        iuranId: pembayaranIuranKhususTable.iuranId,
        totalMasuk: sql<number>`coalesce(sum(${pembayaranIuranKhususTable.nominal}), 0)`.as("total_masuk"),
      })
      .from(pembayaranIuranKhususTable)
      .where(eq(pembayaranIuranKhususTable.status, "lunas"))
      .groupBy(pembayaranIuranKhususTable.iuranId)
      .as("pembayaran_sub");

    const pengeluaranSub = db
      .select({
        iuranKhususId: pengeluaranTable.iuranKhususId,
        totalKeluar: sql<number>`coalesce(sum(${pengeluaranTable.nominal}), 0)`.as("total_keluar"),
      })
      .from(pengeluaranTable)
      .where(eq(pengeluaranTable.sumberDana, "khusus"))
      .groupBy(pengeluaranTable.iuranKhususId)
      .as("pengeluaran_sub");

    const qb = db
      .select({
        id: iuranKhususTable.id,
        judul: iuranKhususTable.judul,
        deskripsi: iuranKhususTable.deskripsi,
        nominalAnjuran: iuranKhususTable.nominalAnjuran,
        tanggalAkhir: iuranKhususTable.tanggalAkhir,
        saldo: sql<number>`coalesce(${pembayaranSub.totalMasuk}, 0) - coalesce(${pengeluaranSub.totalKeluar}, 0)`,
      })
      .from(iuranKhususTable)
      .leftJoin(pembayaranSub, eq(iuranKhususTable.id, pembayaranSub.iuranId))
      .leftJoin(pengeluaranSub, eq(iuranKhususTable.id, pengeluaranSub.iuranKhususId))
      .orderBy(desc(iuranKhususTable.id))
      .where(and(...conditions));

    const offset = (query.page - 1) * query.limit;
    const total = await db.$count(qb);
    const data = await qb.limit(query.limit).offset(offset);

    return { total, data };
  }

  static async getIuranKhusus(query: PaginationSearchSchema) {
    const conditions: (SQL<unknown> | undefined)[] = [];

    if (query.search) {
      const searchCondition = `%${query.search}%`;
      conditions.push(or(ilike(iuranKhususTable.judul, searchCondition)));
    }

    const qb = db.select({
      id: iuranKhususTable.id,
      judul: iuranKhususTable.judul,
      deskripsi: iuranKhususTable.deskripsi,
      nominalAnjuran: iuranKhususTable.nominalAnjuran,
      tanggalAkhir: iuranKhususTable.tanggalAkhir,
    })
      .from(iuranKhususTable)
      .orderBy(desc(iuranKhususTable.id))
      .where(and(...conditions));

    const offset = (query.page - 1) * query.limit;
    const total = await db.$count(qb);
    const data = await qb.limit(query.limit).offset(offset);

    return { total, data };
  }

  static async getPembayaranIuranKhusus(
    iuranId: number,
    userId?: number,
  ) {
    const conditions = [eq(pembayaranIuranKhususTable.iuranId, iuranId)];

    if (userId) {
      conditions.push(
        eq(pembayaranIuranKhususTable.userId, userId),
      );
    }

    const data = await db
      .select({
        id: pembayaranIuranKhususTable.id,
        namaUser: userTable.name,
        status: pembayaranIuranKhususTable.status,
        nominal: pembayaranIuranKhususTable.nominal,
        tanggalBayar: pembayaranIuranKhususTable.tanggalBayar,
      })
      .from(pembayaranIuranKhususTable)
      .innerJoin(
        userTable,
        eq(pembayaranIuranKhususTable.userId, userTable.id),
      )
      .where(and(...conditions))
      .orderBy(desc(pembayaranIuranKhususTable.id));

    return data;
  }

  static async getIuranKhususOptions() {
    return db.select({
      id: iuranKhususTable.id,
      judul: iuranKhususTable.judul,
    })
      .from(iuranKhususTable)
      .orderBy(desc(iuranKhususTable.id));
  }
}
