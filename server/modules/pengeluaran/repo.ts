import type { SQL } from "drizzle-orm";
import type { CreatePengeluaranSchema, GetPengeluaranSchema, UpdatePengeluaranSchema } from "./model";
import { and, desc, eq, ilike, inArray, sql } from "drizzle-orm";
import { db } from "~~/server/database";
import { iuranKhususTable } from "~~/server/database/schema/iuran";
import { pengeluaranTable } from "~~/server/database/schema/pengeluaran";

export abstract class PengeluaranRepo {
  static async create(data: CreatePengeluaranSchema) {
    const [result] = await db
      .insert(pengeluaranTable)
      .values({
        deskripsi: data.deskripsi,
        nominal: data.nominal,
        tanggal: data.tanggal,
        sumberDana: data.sumberDana,
        iuranKhususId: data.sumberDana === "bulanan" ? null : data.iuranKhususId,
      })
      .returning();
    return result;
  }

  static async update(id: number, data: UpdatePengeluaranSchema) {
    const [result] = await db
      .update(pengeluaranTable)
      .set({
        deskripsi: data.deskripsi,
        nominal: data.nominal,
        tanggal: data.tanggal,
        sumberDana: data.sumberDana,
        iuranKhususId: data.sumberDana === "bulanan" ? null : data.iuranKhususId,
      })
      .where(eq(pengeluaranTable.id, id))
      .returning();
    return result;
  }

  static async findAll(query: GetPengeluaranSchema) {
    const conditions: (SQL<unknown> | undefined)[] = [];

    if (query.search) {
      const searchCondition = `%${query.search}%`;
      conditions.push(ilike(pengeluaranTable.deskripsi, searchCondition));
    }

    if (query.tahun) {
      conditions.push(
        sql`extract(year from ${pengeluaranTable.tanggal}) = ${query.tahun}`,
      );
    }

    if (query.bulan) {
      conditions.push(
        sql`extract(month from ${pengeluaranTable.tanggal}) = ${query.bulan}`,
      );
    }

    const qb = db.select({
      id: pengeluaranTable.id,
      deskripsi: pengeluaranTable.deskripsi,
      nominal: pengeluaranTable.nominal,
      tanggal: pengeluaranTable.tanggal,
      sumberDana: pengeluaranTable.sumberDana,
      iuranKhususId: pengeluaranTable.iuranKhususId,
    })
      .from(pengeluaranTable)
      .leftJoin(iuranKhususTable, eq(pengeluaranTable.iuranKhususId, iuranKhususTable.id))
      .orderBy(desc(pengeluaranTable.id))
      .where(and(...conditions));

    const offset = (query.page - 1) * query.limit;
    const total = await db.$count(qb);
    const data = await qb.limit(query.limit).offset(offset);

    // const formattedData = data.map(item => ({
    //   ...item,
    //   sumberDana: item.sumberDana === 'bulanan' ? 'Kas' : ,
    // }));

    return { total, data };
  }

  static async delete(ids: number[]) {
    return await db
      .delete(pengeluaranTable)
      .where(inArray(pengeluaranTable.id, ids));
  }
}
