import type { SQL } from "drizzle-orm";
import type { PaginationSearchSchema } from "~~/server/utils/schema";
import type { CreatePembayaranBulananSchema } from "./model";
import { and, desc, eq, ilike, inArray, or, sum } from "drizzle-orm";
import { db } from "~~/server/database";
import { userTable } from "~~/server/database/schema/auth";
import { iuranKasBulananTable, pembayaranKasBulananTable, periodeKasBulananTable } from "~~/server/database/schema/iuran";
import { getUniqueNominal } from "~~/server/utils/generator";

const KAS_BULANAN_NOMINAL = 50000;

export abstract class IuranBulananRepo {
  static async createKasBulanan() {
    await db
      .insert(iuranKasBulananTable)
      .values({
        judul: `Kas Bulanan ${new Date().getFullYear()}`,
        tahun: new Date().getFullYear(),
        nominalPerBulan: KAS_BULANAN_NOMINAL,
      })
      .returning();
  }

  static async checkExistingBulanPembayaran(userId: number, iuranId: number) {
    const existing = await db
      .select({
        bulan: periodeKasBulananTable.bulan,
      })
      .from(pembayaranKasBulananTable)
      .innerJoin(
        periodeKasBulananTable,
        eq(periodeKasBulananTable.pembayaranId, pembayaranKasBulananTable.id),
      )
      .where(
        and(
          eq(pembayaranKasBulananTable.userId, userId),
          eq(pembayaranKasBulananTable.iuranId, iuranId),
        ),
      );

    return existing;
  }

  static async pembayaranKasBulanan(userId: number, payload: CreatePembayaranBulananSchema) {
    return await db.transaction(async (tx) => {
      const nominal = await getUniqueNominal(KAS_BULANAN_NOMINAL * payload.periode.length, pembayaranKasBulananTable, pembayaranKasBulananTable.nominal);
      const [pembayaran] = await tx.insert(pembayaranKasBulananTable).values({
        iuranId: payload.iuranId,
        nominal,
        userId,
      }).returning();

      if (!pembayaran) {
        throw new Error("Failed to create tagihan");
      }

      const periodePayload = payload.periode.map(u => ({
        pembayaranId: pembayaran.id,
        bulan: u,
      }));

      await tx.insert(periodeKasBulananTable).values(periodePayload);

      return {
        pembayaranId: pembayaran.id,
        nominal,
      };
    });
  }

  static async updateStatusPembayaranKasBulanan(
    id: number,
    status: "pending" | "menunggu_verifikasi" | "lunas",
    tanggalBayar?: string,
  ) {
    return await db.update(pembayaranKasBulananTable)
      .set({ status, tanggalBayar })
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
        ),
      );
    }

    const qb = db.select({
      id: iuranKasBulananTable.id,
      judul: iuranKasBulananTable.judul,
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
      )
      .orderBy(pembayaranKasBulananTable.iuranId, periodeKasBulananTable.bulan);

    const bulanMap = new Map<number, { bulan: number; status: string }[]>();

    for (const row of pembayaran) {
      const bulanList = bulanMap.get(row.iuranId) ?? [];
      bulanList.push({
        bulan: row.bulan,
        status: row.status,
      });
      bulanMap.set(row.iuranId, bulanList);
    }

    const result = kasBulanan.map(kas => ({
      ...kas,
      bulan: bulanMap.get(kas.id) ?? [],
    }));

    return {
      total,
      data: result,
    };
  }

  static async getHistoryKasBulanan(userId: number, iuranId: number) {
    const history = await db
      .select({
        id: pembayaranKasBulananTable.id,
        status: pembayaranKasBulananTable.status,
        nominal: pembayaranKasBulananTable.nominal,
        tanggalBayar: pembayaranKasBulananTable.tanggalBayar,
      })
      .from(pembayaranKasBulananTable)
      .where(and(eq(pembayaranKasBulananTable.userId, userId), eq(pembayaranKasBulananTable.iuranId, iuranId)))
      .orderBy(desc(pembayaranKasBulananTable.id));

    return history;
  }

  static async getAllUserKasBulananByTahun(tahun: number, query: PaginationSearchSchema) {
    const iuran = await db
      .select({ id: iuranKasBulananTable.id })
      .from(iuranKasBulananTable)
      .where(eq(iuranKasBulananTable.tahun, tahun))
      .limit(1)
      .then(res => res[0]);

    if (!iuran) {
      return { total: 0, data: [] };
    }

    const conditions: (SQL<unknown> | undefined)[] = [];

    if (query.search) {
      const searchCondition = `%${query.search}%`;
      conditions.push(
        or(
          ilike(userTable.name, searchCondition),
        ),
      );
    }

    const userQb = db.select({
      id: userTable.id,
      nama: userTable.name,
    })
      .from(userTable)
      .orderBy(desc(userTable.id))
      .where(and(...conditions));

    const offset = (query.page - 1) * query.limit;
    const total = await db.$count(userQb);
    const users = await userQb.limit(query.limit).offset(offset);

    const userIds = users.map(u => u.id);

    if (userIds.length === 0) {
      return { total, data: [] };
    }

    const pembayaran = await db
      .select({
        id: pembayaranKasBulananTable.id,
        userId: pembayaranKasBulananTable.userId,
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
          eq(pembayaranKasBulananTable.iuranId, iuran.id),
          inArray(pembayaranKasBulananTable.userId, userIds),
        ),
      );

    const bulanMap = new Map<number, { bulan: number; status: string }[]>();
    const historyMap = new Map<number, {
      id: number;
      status: "pending" | "menunggu_verifikasi" | "lunas";
      nominal: number;
      tanggalBayar: string | null;
    }[]>();

    for (const row of pembayaran) {
      const bulanList = bulanMap.get(row.userId) ?? [];
      bulanList.push({
        bulan: row.bulan,
        status: row.status,
      });
      bulanMap.set(row.userId, bulanList);

      const historyList = historyMap.get(row.userId) ?? [];
      if (!historyList.some(h => h.id === row.id)) {
        historyList.push({
          id: row.id,
          status: row.status,
          nominal: row.nominal,
          tanggalBayar: row.tanggalBayar,
        });
      }
      historyMap.set(row.userId, historyList);
    }

    const result = users.map(user => ({
      ...user,
      bulan: bulanMap.get(user.id) ?? [],
      historyPembayaran: historyMap.get(user.id) ?? [],
    }));

    return {
      total,
      data: result,
    };
  }

  static async getRingkasanKasByTahun(tahun: number) {
    const iuran = await db
      .select({
        id: iuranKasBulananTable.id,
        nominalPerBulan: iuranKasBulananTable.nominalPerBulan,
      })
      .from(iuranKasBulananTable)
      .where(eq(iuranKasBulananTable.tahun, tahun))
      .limit(1)
      .then(res => res[0]);

    if (!iuran) {
      return { nominalSeharusnya: 0, nominalDibayar: 0 };
    }

    const totalUsers = await db.$count(userTable);
    const nominalSeharusnya = totalUsers * iuran.nominalPerBulan * 12;

    const [pembayaran] = await db
      .select({
        totalDibayar: sum(pembayaranKasBulananTable.nominal).mapWith(Number),
      })
      .from(pembayaranKasBulananTable)
      .where(
        and(
          eq(pembayaranKasBulananTable.iuranId, iuran.id),
          eq(pembayaranKasBulananTable.status, "lunas"),
        ),
      );

    return {
      nominalSeharusnya,
      nominalDibayar: pembayaran?.totalDibayar ?? 0,
    };
  }
}
