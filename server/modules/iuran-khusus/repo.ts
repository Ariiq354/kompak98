import type { SQL } from "drizzle-orm";
import type { PaginationSearchSchema } from "~~/server/utils/schema";
import type { CreateIuranKhususSchema, CreatePembayaranKhususSchema, UpdateIuranKhususSchema } from "./model";
import { isAfter, parseISO, startOfDay } from "date-fns";
import { and, desc, eq, ilike, inArray, or } from "drizzle-orm";
import { db } from "~~/server/database";
import { userTable } from "~~/server/database/schema/auth";
import { iuranKhususTable, pembayaranIuranKhususTable } from "~~/server/database/schema/iuran";
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
      const nominal = await getUniqueNominal(payload.nominal, pembayaranIuranKhususTable, pembayaranIuranKhususTable.nominal);
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

  static async getIuranKhususByUser(userId: number, query: PaginationSearchSchema) {
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
    const iuranKhusus = await qb.limit(query.limit).offset(offset);

    const iuranIds = iuranKhusus.map(i => i.id);

    if (iuranIds.length === 0) {
      return { data: [], total: 0 };
    }

    const pembayaran = await db
      .select({
        id: pembayaranIuranKhususTable.id,
        iuranId: pembayaranIuranKhususTable.iuranId,
        status: pembayaranIuranKhususTable.status,
        nominal: pembayaranIuranKhususTable.nominal,
        tanggalBayar: pembayaranIuranKhususTable.tanggalBayar,
      })
      .from(pembayaranIuranKhususTable)
      .where(
        and(
          eq(pembayaranIuranKhususTable.userId, userId),
          inArray(pembayaranIuranKhususTable.iuranId, iuranIds),
        ),
      )
      .orderBy(desc(pembayaranIuranKhususTable.id));

    const historyMap = new Map<number, { id: number; status: string; nominal: number; tanggalBayar: string | null }[]>();
    for (const row of pembayaran) {
      const list = historyMap.get(row.iuranId) ?? [];
      list.push({
        id: row.id,
        status: row.status,
        nominal: row.nominal,
        tanggalBayar: row.tanggalBayar,
      });
      historyMap.set(row.iuranId, list);
    }

    const result = iuranKhusus.map(iuran => ({
      ...iuran,
      historyPembayaran: historyMap.get(iuran.id) ?? [],
    }));

    return { total, data: result };
  }

  static async getAllIuranKhusus(query: PaginationSearchSchema) {
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
    const iuranKhusus = await qb.limit(query.limit).offset(offset);

    const iuranIds = iuranKhusus.map(i => i.id);

    if (iuranIds.length === 0) {
      return { data: [], total: 0 };
    }

    const pembayaran = await db
      .select({
        id: pembayaranIuranKhususTable.id,
        namaUser: userTable.name,
        iuranId: pembayaranIuranKhususTable.iuranId,
        status: pembayaranIuranKhususTable.status,
        nominal: pembayaranIuranKhususTable.nominal,
        tanggalBayar: pembayaranIuranKhususTable.tanggalBayar,
      })
      .from(pembayaranIuranKhususTable)
      .innerJoin(userTable, eq(pembayaranIuranKhususTable.userId, userTable.id))
      .where(
        inArray(pembayaranIuranKhususTable.iuranId, iuranIds),
      )
      .orderBy(desc(pembayaranIuranKhususTable.id));

    type PembayaranRow = typeof pembayaran[number];

    const historyMap = new Map<number, Omit<PembayaranRow, "iuranId">[]>();

    for (const row of pembayaran) {
      const list = historyMap.get(row.iuranId) ?? [];
      list.push({
        id: row.id,
        namaUser: row.namaUser,
        status: row.status,
        nominal: row.nominal,
        tanggalBayar: row.tanggalBayar,
      });
      historyMap.set(row.iuranId, list);
    }

    const result = iuranKhusus.map(iuran => ({
      ...iuran,
      historyPembayaran: historyMap.get(iuran.id) ?? [],
    }));

    return { total, data: result };
  }
}
