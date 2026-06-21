import type { SQL } from "drizzle-orm";
import type { PaginationSearchSchema } from "~~/server/utils/schema";
import type { CreatePembayaranBulananSchema, CreateTagihanKhususSchema } from "./model";
import { and, desc, eq, ilike, inArray, ne, or } from "drizzle-orm";
import { db } from "~~/server/database";
import { userTable } from "~~/server/database/schema/auth";
import { iuranKasBulananTable, pembayaranKasBulananTable, periodeKasBulananTable } from "~~/server/database/schema/iuran";
import { tagihanAnggotaTable, tagihanTable } from "~~/server/database/schema/tagihan";
import { getUniqueNominal } from "~~/server/utils/generator";

export abstract class IuranRepo {
  static async createKasBulanan(data: CreateTagihanKhususSchema) {
    await db
      .insert(iuranKasBulananTable)
      .values(data)
      .returning();
  }

  static async createPembayaran(userId: number, payload: CreatePembayaranBulananSchema) {
    return await db.transaction(async (tx) => {
      const nominal = await getUniqueNominal(payload.nominal, pembayaranKasBulananTable, pembayaranKasBulananTable.nominal);
      const [pembayaran] = await tx.insert(pembayaranKasBulananTable).values({
        iuranId: payload.iuranId,
        nominal,
        userId,
        tanggalBayar: new Date().toDateString(),
      }).returning();

      if (!pembayaran) {
        throw new Error("Failed to create tagihan");
      }

      const periodePayload = payload.periode.map(u => ({
        pembayaranId: pembayaran.id,
        bulan: u,
      }));

      await tx.insert(periodeKasBulananTable).values(periodePayload);
    });
  }

  static async adminVerifikasi(id: number) {
    return await db.update(pembayaranKasBulananTable)
      .set({ status: "lunas" })
      .where(eq(pembayaranKasBulananTable.id, id))
      .returning();
  }

  static async getKasBulananByUser(userId: number, query: PaginationSearchSchema) {
    const conditions: (SQL<unknown> | undefined)[] = [];

    if (query.search) {
      const searchCondition = `%${query.search}%`;
      conditions.push(
        or(
          ilike(iuranKasBulananTable.judul, searchCondition),
          ilike(iuranKasBulananTable.deskripsi, searchCondition),
        ),
      );
    }

    const qb = db.select({
      id: iuranKasBulananTable.id,
      judul: iuranKasBulananTable.judul,
      deskripsi: iuranKasBulananTable.deskripsi,
      nominalPerBulan: iuranKasBulananTable.nominalPerBulan,
      tahun: iuranKasBulananTable.tahun,
    })
      .from(iuranKasBulananTable)
      .orderBy(desc(iuranKasBulananTable.id))
      .where(and(...conditions));

    const offset = (query.page - 1) * query.limit;
    const total = await db.$count(qb);
    const kasBulanan = await qb.limit(query.limit).offset(offset);

    const iuranIds = kasBulanan.map(kas => kas.id);

    if (iuranIds.length === 0) {
      return {
        data: [],
        total: 0,
      };
    }

    const pembayaran = await db
      .select({
        iuranId: pembayaranKasBulananTable.iuranId,
        status: pembayaranKasBulananTable.status,
        bulan: periodeKasBulananTable.bulan,
        nominal: pembayaranKasBulananTable.nominal,
        tanggalBayar: pembayaranKasBulananTable.tanggalBayar,
      })
      .from(pembayaranKasBulananTable)
      .innerJoin(
        periodeKasBulananTable,
        eq(periodeKasBulananTable.pembayaranId, pembayaranKasBulananTable.id),
      )
      .where(
        and(
          eq(pembayaranKasBulananTable.userId, userId),
          inArray(pembayaranKasBulananTable.iuranId, iuranIds),
        ),
      );

    const bulanMap = new Map<number, { bulan: number; status: string }[]>();
    const historyMap = new Map<number, {
      status: string;
      nominal: number;
      tanggalBayar: string;
    }[]>();

    for (const row of pembayaran) {
      const bulanList = bulanMap.get(row.iuranId) ?? [];
      bulanList.push({
        bulan: row.bulan,
        status: row.status,
      });
      bulanMap.set(row.iuranId, bulanList);

      const historyList = historyMap.get(row.iuranId) ?? [];
      historyList.push({
        status: row.status,
        nominal: row.nominal,
        tanggalBayar: row.tanggalBayar,
      });
      historyMap.set(row.iuranId, historyList);
    }

    const result = kasBulanan.map(kas => ({
      ...kas,
      bulan: bulanMap.get(kas.id) ?? [],
      historyPembayaran: historyMap.get(kas.id) ?? [],
    }));

    return {
      data: result,
      total,
    };
  }

  static async getKasBulananByUser(userId: number, query: PaginationSearchSchema) {
    const conditions: (SQL<unknown> | undefined)[] = [];

    if (query.search) {
      const searchCondition = `%${query.search}%`;
      conditions.push(
        or(
          ilike(iuranKasBulananTable.judul, searchCondition),
          ilike(iuranKasBulananTable.deskripsi, searchCondition),
        ),
      );
    }

    const qb = db.select({
      id: iuranKasBulananTable.id,
      judul: iuranKasBulananTable.judul,
      deskripsi: iuranKasBulananTable.deskripsi,
      nominalPerBulan: iuranKasBulananTable.nominalPerBulan,
      tahun: iuranKasBulananTable.tahun,
    })
      .from(iuranKasBulananTable)
      .orderBy(desc(iuranKasBulananTable.id))
      .where(and(...conditions));

    const offset = (query.page - 1) * query.limit;
    const total = await db.$count(qb);
    const kasBulanan = await qb.limit(query.limit).offset(offset);

    const iuranIds = kasBulanan.map(kas => kas.id);

    if (iuranIds.length === 0) {
      return {
        data: [],
        total: 0,
      };
    }

    const pembayaran = await db
      .select({
        iuranId: pembayaranKasBulananTable.iuranId,
        status: pembayaranKasBulananTable.status,
        bulan: periodeKasBulananTable.bulan,
        nominal: pembayaranKasBulananTable.nominal,
        tanggalBayar: pembayaranKasBulananTable.tanggalBayar,
      })
      .from(pembayaranKasBulananTable)
      .innerJoin(
        periodeKasBulananTable,
        eq(periodeKasBulananTable.pembayaranId, pembayaranKasBulananTable.id),
      )
      .where(
        and(
          eq(pembayaranKasBulananTable.userId, userId),
          inArray(pembayaranKasBulananTable.iuranId, iuranIds),
        ),
      );

    const bulanMap = new Map<number, { bulan: number; status: string }[]>();
    const historyMap = new Map<number, {
      status: string;
      nominal: number;
      tanggalBayar: string;
    }[]>();

    for (const row of pembayaran) {
      const bulanList = bulanMap.get(row.iuranId) ?? [];
      bulanList.push({
        bulan: row.bulan,
        status: row.status,
      });
      bulanMap.set(row.iuranId, bulanList);

      const historyList = historyMap.get(row.iuranId) ?? [];
      historyList.push({
        status: row.status,
        nominal: row.nominal,
        tanggalBayar: row.tanggalBayar,
      });
      historyMap.set(row.iuranId, historyList);
    }

    const result = kasBulanan.map(kas => ({
      ...kas,
      bulan: bulanMap.get(kas.id) ?? [],
      historyPembayaran: historyMap.get(kas.id) ?? [],
    }));

    return {
      data: result,
      total,
    };
  }
}
