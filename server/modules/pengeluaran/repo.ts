import type { SQL } from "drizzle-orm";
import type { PaginationSearchSchema } from "~~/server/utils/schema";
import type { CreatePengeluaranSchema } from "./model";
import { and, desc, ilike, inArray } from "drizzle-orm";
import { db } from "~~/server/database";
import { pengeluaranTable } from "~~/server/database/schema/pengeluaran";

export abstract class PengeluaranRepo {
  static async create(data: CreatePengeluaranSchema) {
    const [result] = await db
      .insert(pengeluaranTable)
      .values({
        judul: data.judul,
        nominal: data.nominal,
        tanggal: data.tanggal,
        sumberDana: data.sumberDana,
        iuranKhususId: data.sumberDana === "bulanan" ? null : (data.iuranKhususId ?? null),
      })
      .returning();
    return result;
  }

  static async findAll(query: PaginationSearchSchema) {
    const conditions: (SQL<unknown> | undefined)[] = [];

    if (query.search) {
      const searchCondition = `%${query.search}%`;
      conditions.push(ilike(pengeluaranTable.judul, searchCondition));
    }

    const qb = db.select({
      id: pengeluaranTable.id,
      judul: pengeluaranTable.judul,
      nominal: pengeluaranTable.nominal,
      tanggal: pengeluaranTable.tanggal,
      sumberDana: pengeluaranTable.sumberDana,
      iuranKhususId: pengeluaranTable.iuranKhususId,
    })
      .from(pengeluaranTable)
      .orderBy(desc(pengeluaranTable.id))
      .where(and(...conditions));

    const offset = (query.page - 1) * query.limit;
    const total = await db.$count(qb);
    const data = await qb.limit(query.limit).offset(offset);

    return { total, data };
  }

  static async delete(ids: number[]) {
    return await db
      .delete(pengeluaranTable)
      .where(inArray(pengeluaranTable.id, ids));
  }
}
